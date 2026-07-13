// catApi.js — Servicio de consumo de la API (The Cat API)
// Centraliza las llamadas con Axios para no repetir la URL en cada pantalla. 
// La API solo devuelve id, url, width, height.
// IA: me mostró cómo crear una instancia de axios con baseURL.
// Nosotros: separamos esto en su propio módulo src/api/ para tener el código en un solo lugar (más ordenado que ponerlo suelto en cada screen).
import axios from 'axios';

// Instancia reutilizable de Axios apuntando a The Cat API
const cliente = axios.create({
  baseURL: 'https://api.thecatapi.com/v1',
  timeout: 10000,
});

// Trae "cantidad" imágenes de gatos. Por defecto 15 
export async function obtenerGatos(cantidad = 15) {
  const { data } = await cliente.get('/images/search', {
    params: { limit: cantidad, size: 'med' },
  });
  return data; // -> [{ id, url, width, height }, ...]
}
