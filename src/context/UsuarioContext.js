// UsuarioContext.js — Contexto del usuario logueado
// Guarda los datos del usuario en un solo lugar para que cualquier
// pantalla o componente los pueda leer con useContext (sin pasar props).
import { createContext, useState } from 'react';
import { usuarioActual } from '../data/userData';

export const UsuarioContext = createContext(null);

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(usuarioActual);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
}
