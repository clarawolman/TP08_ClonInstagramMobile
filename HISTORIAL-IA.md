# Historial de trabajo con la IA — TP8
---

## Prompt 1 — Arranque y migración del TP anterior

**Rol:** Actuá como un dev de React Native senior.
**Contexto:** Vengo de un TP donde hice Instagram Web con React normal. Ahora tengo que migrarlo a React Native con Expo.
**Tarea:** Explicame qué cambia respecto a React web y armame el esqueleto de navegación (feed, detalle y perfil).
**Restricciones:** Solo React Navigation, nada de librerías raras.

**Qué me dio:** la explicación de `View`/`Text` vs HTML y un `BottomTabNavigator`
con dos `Stack` anidados (Home y Profile).
**Qué hice:** lo usé como base de `AppNavigator.js` y después personalicé los
headers (logo serif, íconos) y los colores.

---

## Prompt 2 — Feed con FlatList y consumo de API

**Contexto:** Estoy armando el feed. Los datos son imágenes de The Cat API.
**Tarea:** Necesito traer 15 imágenes con Axios dentro de useEffect y mostrarlas en una lista.
**Restricción CRÍTICA:** Está PROHIBIDO usar `.map()` en un ScrollView.  Tiene que ser sí o sí `FlatList`. Explicame por qué es mejor.

**Qué me dio:** el patrón `useEffect` + `axios.get` con estados `cargando`/`error`
y un `FlatList` con `ListHeaderComponent`. Me explicó que `FlatList` solo
renderiza los ítems visibles (virtualización).
**Qué hice:** lo integré en `HomeScreen.js`. Después moví la llamada de Axios a
un módulo aparte `src/api/catApi.js` (ver Prompt 3).

---

## Prompt 3 — Iteración: ordenar el código de la API

**Contexto:** Tengo el `axios.get` copiado en HomeScreen y en ProfileScreen.
**Tarea:** ¿Cómo lo dejo más ordenado para no repetir la URL?

**Qué me dio:** la idea de crear una instancia de `axios` con `baseURL`.
**Qué hice (decisión propia):** creé `src/api/catApi.js` con la función
`obtenerGatos(cantidad)` y desde las pantallas solo la importo. Queda todo el
código de red en un solo lugar.

---

## Prompt 4 — La API no trae datos de Instagram

**Contexto:** La API de gatos solo devuelve `id` y `url`. No tiene usuario,
ni likes, ni comentarios, así que mi feed no parece Instagram.
**Tarea:** ¿Cómo hago para que cada foto tenga autor, leyenda, ubicación y
likes sin una API que los dé?

**Qué me dio:** la idea de tener datos mock aparte y combinarlos con la imagen.
**Qué hice:** creé `userData.js` con arrays de autores, leyendas, ubicaciones y
comentarios, y la función `construirPost()` que mezcla la imagen real con esos
datos. Está explicado en `REFLEXION.md`.

---

## Prompt 5 — Like reactivo

**Contexto:** En la pantalla de detalle del post (`PostDetailScreen`).
**Tarea:** Quiero que al tocar el corazón cambie de color Y suba el contador
de "Me gusta" al instante.
**Restricción:** Con `useState`, sin librerías de estado.

**Qué me dio:** el toggle con `useState` (`conLike` + `likes`).
**Qué hice:** lo apliqué igual en `PostCard.js` para que cada post del feed
tenga su propio like independiente.

---

## Prompt 6 — Grilla de 3 columnas del perfil

**Contexto:** Pantalla de perfil, mosaico de fotos de abajo.
**Tarea:** Grilla perfecta de 3 columnas que no desborde en ningún celular.
**Restricción:** Con `FlatList` y `numColumns={3}`.

**Qué me dio:** `FlatList numColumns={3}` calculando el tamaño de cada celda
como `ancho_de_pantalla / 3`.
**Qué hice:** lo usé y cambié `TouchableOpacity` por `Pressable` en las celdas
para demostrar los dos componentes táctiles.

---

## Prompt 7 — Assets del sistema (splash, ícono, StatusBar)

**Tarea:** Cómo reemplazo la splash por defecto de Expo, pongo un ícono
propio y estilizo la StatusBar. No tengo Photoshop.

**Qué me dio:** la configuración de `app.json` (`splash`, `icon`, `adaptiveIcon`)
y un script en Python (`docs/gen_assets.py`) para generar el ícono y la splash
con el gradiente de Instagram sin editor de imágenes.
**Qué hice:** corrí el script, ajusté los colores a la paleta de Instagram y
dejé la StatusBar en `style="dark"`.
