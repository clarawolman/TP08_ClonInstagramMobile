# Guion de defensa oral (5 min) — TP8 Clon de Instagram

> Notas para la defensa en clase. La idea es contar QUÉ hice, CÓMO lo hice y
> DÓNDE usé la IA. No leer palabra por palabra.

## 1. Qué es el proyecto (30 s)
Es un clon móvil de Instagram hecho con **React Native + Expo**. Es la migración
del TP anterior, que era Instagram Web en React. El feed no usa fotos fijas:
trae imágenes en tiempo real desde **The Cat API** con Axios.

## 2. Cómo está organizado (1 min)
- `App.js` → punto de entrada: SplashScreen, StatusBar y NavigationContainer.
- `src/api/` → `catApi.js`, el servicio que hace las llamadas con Axios.
- `src/navigation/` → un **BottomTab** (Home / Perfil) con **Stacks anidados**
  para poder ir al detalle del post desde las dos pestañas.
- `src/screens/` → las 3 pantallas: Feed, Detalle y Perfil.
- `src/components/` → `PostCard` (cada post) y `Stories` (el carrusel de arriba).
- `src/data/` → los datos simulados que combino con las fotos.

## 3. Lo técnico que me pueden preguntar (2 min)
- **¿Por qué FlatList y no `.map()`?** Porque `FlatList` virtualiza: solo dibuja
  los ítems que se ven en pantalla. Con `.map()` en un ScrollView se renderizan
  todos juntos y el scroll se pone lento. Además la consigna lo prohíbe.
- **¿Cómo traés los datos?** Con `axios.get` (dentro de `catApi.js`) llamado
  desde un `useEffect` que corre una sola vez al montar la pantalla. Guardo el
  resultado en `useState`.
- **La API solo da id y url**, así que armé `construirPost()` para completar
  autor, likes, leyenda y comentarios y que parezca Instagram real.
- **Like reactivo:** con `useState` cambio el estado `conLike` (color del
  corazón) y el contador `likes` al mismo tiempo, sin recargar nada.
- **Grilla del perfil:** `FlatList` con `numColumns={3}` y cada celda mide
  `ancho / 3` para que sea simétrica y no desborde.
- **Navegación con parámetros:** al tocar un post mando el objeto completo con
  `navigation.navigate('PostDetail', { post })` y lo leo con `route.params`.

## 4. Dónde usé la IA (1 min)
La usé como apoyo, no para que hiciera todo (ver `HISTORIAL-IA.md` y
`REFLEXION.md`). Me armó los esqueletos (navegación, feed, like) y me explicó
conceptos nuevos. Yo decidí la parte de mezclar datos reales + simulados, separé
el código de la API en su propio módulo, ajusté todos los estilos mirando Figma
y cambié la grilla a `Pressable`. Cada archivo tiene un comentario arriba que
marca **qué generó la IA y qué modifiqué yo**.

## 5. Cierre (30 s)
Lo más difícil fue entender lo asíncrono (esperar a la API) y lograr fidelidad
visual con Instagram. Lo que más aprendí fue Flexbox en móvil, `FlatList` y a
usar la IA con prompts específicos en vez de pedirle todo junto.

---
### Posibles preguntas del profe
- *¿Qué pasa si la API falla?* → tengo un estado `error` que muestra un mensaje.
- *¿Estado global o local?* → todo local con `useState`; no hizo falta Context/Redux.
- *¿Por qué SafeAreaView?* → para que el contenido no choque con el notch/isla dinámica.
