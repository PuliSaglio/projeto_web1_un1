import { db } from './firebaseConfig.js';
import { ref, get, child, push, set, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const PACOTES_PATH = 'pacotes';

export async function listarPacotes() {
  const snapshot = await get(child(ref(db), PACOTES_PATH));
  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
  }
  return [];
}

export async function buscarPacotePorId(id) {
  const snapshot = await get(child(ref(db), `${PACOTES_PATH}/${id}`));
  if (snapshot.exists()) return snapshot.val();
  return null;
}

export async function adicionarPacote(pacote) {
  const novaRef = push(ref(db, PACOTES_PATH));
  await set(novaRef, pacote);
  return novaRef.key;
}

export async function atualizarPacote(id, dados) {
  await update(ref(db, `${PACOTES_PATH}/${id}`), dados);
}

export async function deletarPacote(id) {
  await remove(ref(db, `${PACOTES_PATH}/${id}`));
}