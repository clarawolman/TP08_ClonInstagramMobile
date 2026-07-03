# Generador de assets (icono + splash) sin dependencias externas.
# Escribe PNGs RGBA usando solo zlib y struct.
# [IA] Este script de generacion de imagenes lo arme con ayuda de IA porque
#      no tenia Photoshop a mano para el icono. Ajuste los colores a la paleta de Instagram.
import zlib, struct, math

def write_png(path, width, height, pixel_fn):
    raw = bytearray()
    for y in range(height):
        raw.append(0)  # filtro None por fila
        for x in range(width):
            r, g, b, a = pixel_fn(x, y, width, height)
            raw += bytes((r, g, b, a))
    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        c += struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
        return c
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw), 9)
    with open(path, "wb") as f:
        f.write(sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b""))

def lerp(a, b, t):
    return int(a + (b - a) * t)

# Paleta del gradiente de Instagram (amarillo -> rosa -> violeta)
STOPS = [
    (0.00, (250, 210, 90)),
    (0.35, (245, 110, 90)),
    (0.65, (215, 45, 130)),
    (1.00, (120, 55, 210)),
]

def gradient_color(t):
    for i in range(len(STOPS) - 1):
        t0, c0 = STOPS[i]
        t1, c1 = STOPS[i + 1]
        if t0 <= t <= t1:
            k = (t - t0) / (t1 - t0)
            return (lerp(c0[0], c1[0], k), lerp(c0[1], c1[1], k), lerp(c0[2], c1[2], k))
    return STOPS[-1][1]

def icon_pixel(x, y, w, h):
    # gradiente diagonal
    t = (x + y) / (w + h)
    r, g, b = gradient_color(t)
    cx, cy = w / 2, h / 2
    # marco redondeado de la camara (cuadrado con esquinas)
    outer = w * 0.30
    inner = w * 0.235
    dx, dy = abs(x - cx), abs(y - cy)
    # borde del cuadrado
    on_square = (max(dx, dy) < outer) and (max(dx, dy) > inner)
    # lente central
    dist = math.hypot(x - cx, y - cy)
    lens = dist < w * 0.135
    lens_border = (dist < w * 0.155) and (dist >= w * 0.135)
    # punto del flash
    flash = math.hypot(x - (cx + w * 0.17), y - (cy - h * 0.17)) < w * 0.028
    if on_square or lens_border or flash:
        return (255, 255, 255, 255)
    if lens:
        return (255, 255, 255, 60)  # brillo tenue del lente
    return (r, g, b, 255)

def splash_pixel(x, y, w, h):
    # Fondo oscuro estilo Instagram con el logo centrado
    bg = (10, 10, 12)
    cx, cy = w / 2, h / 2
    s = min(w, h) * 0.55  # tamano del logo
    lx, ly = x - (cx - s / 2), y - (cy - s / 2)
    if 0 <= lx < s and 0 <= ly < s:
        px, py = int(lx / s * 256), int(ly / s * 256)
        col = icon_pixel(px, py, 256, 256)
        if col[3] == 255:
            return col
    return (bg[0], bg[1], bg[2], 255)

if __name__ == "__main__":
    write_png("../assets/icon.png", 512, 512, icon_pixel)
    write_png("../assets/adaptive-icon.png", 512, 512, icon_pixel)
    write_png("../assets/favicon.png", 96, 96, icon_pixel)
    write_png("../assets/splash.png", 720, 1280, splash_pixel)
    print("Assets generados OK")
