const API_URL = 'http://localhost:3000/voos';

export async function listarVoos() {
  const response = await fetch(API_URL);
  const voos = await response.json();
  return voos;
}

export async function adicionarVoo(voo) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(voo)
  });
  return response.json();
}

export async function atualizarVoo(id, dadosAtualizados) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosAtualizados)
  });
  return response.json();
}

export async function deletarVoo(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}