import { db } from './firebaseConfig.js';
import { ref, get, set, push, remove, child, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const VOOS_PATH = 'voos';

export async function listarVoos() {
  const snapshot = await get(child(ref(db), VOOS_PATH));
  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([id, dados]) => ({ id, ...dados }));
  }
  return [];
}

export async function adicionarVoo(voo) {
  const novaRef = push(ref(db, VOOS_PATH));
  await set(novaRef, voo);
  return novaRef.key;
}

export async function atualizarVoo(id, dadosAtualizados) {
  await update(ref(db, `voos/${id}`), dadosAtualizados);
}

export async function deletarVoo(id) {
  await remove(ref(db, `voos/${id}`));
}

export async function buscarVooPorId(id) {
  const snapshot = await get(child(ref(db), `voos/${id}`));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
}