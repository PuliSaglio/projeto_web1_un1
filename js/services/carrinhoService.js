import { db } from './firebaseConfig.js';
import { ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function salvarCarrinho(email, carrinho) {
  await set(ref(db, `carrinhos/${btoa(email)}`), carrinho);
}

export async function obterCarrinho(email) {
  const snapshot = await get(child(ref(db), `carrinhos/${btoa(email)}`));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return [];
}