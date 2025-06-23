import { db } from './firebaseConfig.js';
import { ref, push, set, get, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function listarHospedagens() {
  const snapshot = await get(child(ref(db), 'hospedagens'));
  if (snapshot.exists()) {
    // Retorna array de hospedagens com id
    return Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
  }
  return [];
}

export async function buscarHospedagemPorId(id) {
  const snapshot = await get(child(ref(db), `hospedagens/${id}`));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
}

export async function adicionarHospedagem(hospedagem) {
  const hospedagensRef = ref(db, 'hospedagens');
  const novaRef = push(hospedagensRef);
  await set(novaRef, hospedagem);
  return novaRef.key;
}

export async function atualizarHospedagem(id, dados) {
  await update(ref(db, `hospedagens/${id}`), dados);
}

export async function deletarHospedagem(id) {
  await remove(ref(db, `hospedagens/${id}`));
}