import { db } from './firebaseConfig.js';
import { ref, push, set, get, child, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function usuarioExiste(email) {
  const usuariosRef = ref(db, 'usuarios');
  const snapshot = await get(query(usuariosRef, orderByChild('email'), equalTo(email)));
  return snapshot.exists();
}

export async function adicionarUsuario(usuario) {
  const usuariosRef = ref(db, 'usuarios');
  const novaRef = push(usuariosRef);
  await set(novaRef, usuario);
  return novaRef.key;
}

export async function buscarUsuarioPorEmailESenha(email, senha) {
    const usuariosRef = ref(db, 'usuarios');
    const q = query(usuariosRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(q);
    if (snapshot.exists()) {
        const usuarios = Object.values(snapshot.val());
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);
        return usuario || null;
    }
    return null;
}