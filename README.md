# TP8 — Clon Móvil de Instagram con React Native y Expo

Migración del TP anterior (Instagram Web en React) hacia React Native bajo el
ecosistema de Expo. El feed consume imágenes en tiempo real desde 
The Cat API con Axios y las muestra.

---

## Inicialización del entorno

```bash
npm install
npx expo start
```

Escanear el QR con la app **Expo Go** (iOS o Android), o presionar `a` para el
emulador de Android / `i` para el simulador de iOS / `w` para abrir en el navegador.

---

## Referencia visual (Figma)

- [Instagram Mobile UI Kit](https://www.figma.com/community/file/1235135369163092252)

---

## Árbol de directorios

```
app/  en este proyecto la lógica de pantallas está dentro de src/

src/
├── api/
│   └── catApi.js            # Servicio Axios: llamadas a The Cat API
├── navigation/
│   └── AppNavigator.js      # Bottom Tab + Stack navigators
├── screens/
│   ├── HomeScreen.js        # Feed principal: Stories + FlatList de posts
│   ├── PostDetailScreen.js  # Vista extendida con comentarios y like reactivo
│   └── ProfileScreen.js     # Perfil con grilla FlatList numColumns=3
├── components/
│   ├── PostCard.js          # Componente atómico de cada post del feed
│   └── Stories.js           # Carrusel horizontal de historias
└── data/
    └── userData.js          # Datos mock: usuario, autores, leyendas, comentarios

assets/
├── icon.png                 # Ícono nativo de la app
├── adaptive-icon.png        # Ícono adaptativo para Android
├── splash.png               # SplashScreen personalizada
└── favicon.png              # Favicon para web

docs/
└── gen_assets.py            # Script que generó el ícono y la splash

App.js                       # Entry point: SafeAreaProvider + NavigationContainer + SplashScreen
app.json                     # Configuración Expo (nombre, ícono, splash, bundle ID)
babel.config.js              # Configuración Babel para Expo
package.json                 # Dependencias del proyecto
REFLEXION.md                 # Reflexión escrita (entregable obligatorio)
HISTORIAL-IA.md              # Registro del trabajo con la IA

```

---

## Componentes atómicos y props

### `PostCard.js`
Renderiza un ítem individual del feed. Recibe:

| Prop | Tipo | Descripción |
|------|------|-------------|
| `post` | Object | Objeto completo: `autorUsername`, `autorAvatar`, `imagenUrl`, `leyenda`, `ubicacion`, `likes`, `comentarios`, `tiempo` |
| `onPress` | Function | Callback que navega a `PostDetailScreen` pasando el post completo |

### `Stories.js`
Carrusel horizontal de historias. No recibe props; consume `historias` directamente del módulo `userData.js`.

### `catApi.js` (servicio)
Expone `obtenerGatos(cantidad)`: hace el `axios.get` a The Cat API y devuelve el array de imágenes. Lo usan `HomeScreen` (15) y `ProfileScreen` (12).

---

## Estados (Hooks)

### Estados locales (`useState`)

| Componente | Estado | Descripción |
|---|---|---|
| `PostCard` | `conLike` / `likes` / `guardado` | Like, contador reactivo y guardado por tarjeta |
| `PostDetailScreen` | `conLike` / `likes` / `guardado` | Like reactivo del detalle (independiente del feed) |
| `HomeScreen` | `publicaciones` / `cargando` / `error` | Posts de la API, spinner y manejo de error |
| `ProfileScreen` | `publicaciones` / `cargando` / `tabActiva` | Posts del perfil, spinner y tab seleccionada |

> **Estado global vs local:** toda la app usa **estado local** con `useState`.

### Efectos (`useEffect`)

- **`HomeScreen`**: `obtenerGatos(15)` → mapea y setea `publicaciones`.
- **`ProfileScreen`**: `obtenerGatos(12)` → mapea y setea `publicaciones`.

---

## Arquitectura de navegación

```
NavigationContainer
└── BottomTabNavigator
    ├── Tab: Home → HomeStack (NativeStackNavigator)
    │   ├── Screen: Feed → HomeScreen
    │   └── Screen: PostDetail → PostDetailScreen
    └── Tab: Profile → ProfileStack (NativeStackNavigator)
        ├── Screen: ProfileMain → ProfileScreen
        └── Screen: PostDetail → PostDetailScreen
```

Flujo completo: **Feed → (tap en post) → PostDetail** y **Profile → (tap en grilla) → PostDetail**.
El objeto del post viaja por `navigation.navigate('PostDetail', { post })` y se lee con `route.params`.

---

## API utilizada

**[The Cat API](https://thecatapi.com/)** — `https://api.thecatapi.com/v1/images/search`

- No requiere API key para uso básico.
- Se solicitan 15 imágenes en el feed y 12 en el perfil.
- Cada respuesta incluye `id` y `url` de la imagen (el resto de los datos se simula en `userData.js`).

---

## Checklist de requisitos

- [x] Barra de navegación nativa (Bottom Tab + Stack Header)
- [x] Feed dinámico exclusivamente con `FlatList` (sin `.map()`)
- [x] Mínimo 10 registros asincrónicos vía Axios (se cargan 15)
- [x] Estilos con `StyleSheet.create()` en todos los componentes
- [x] Interacciones con `TouchableOpacity` y `Pressable`
- [x] Flujo Feed → Detalle → Perfil completo y funcional
- [x] Grilla de 3 columnas con `FlatList numColumns={3}` en el perfil
- [x] SplashScreen personalizada (`expo-splash-screen`)
- [x] Ícono nativo configurado en `app.json`
- [x] StatusBar estilizada (`expo-status-bar`)
- [x] `SafeAreaView` / `SafeAreaProvider` en la app
- [x] Like interactivo con `useState` (color + contador en tiempo real)

---

## Entregables (además del código)

| # | Entregable | Dónde está |
|---|------------|------------|
| 1 | Código en GitHub | Este repositorio (sin `node_modules/`) |
| 2 | Historial con la IA | [`HISTORIAL-IA.md`](./HISTORIAL-IA.md) + capturas en `docs/` |
| 3 | Reflexión escrita (300–600 palabras) | [`REFLEXION.md`](./REFLEXION.md) |
| 4 | Comentarios en código (qué generó la IA) | Cabecera de cada archivo en `src/` y `App.js` |
