import * as voosService from '../services/voosService.js';

function getUsuarioLogado() {
  const usuario = sessionStorage.getItem("usuarioLogado");
  return usuario ? JSON.parse(usuario) : null;
}

const usuario = getUsuarioLogado();
if (!usuario || usuario.role !== "admin") {
  window.location.href = "/html/login.html";
  throw new Error("Acesso negado: apenas administradores podem acessar esta página.");
}

const voo = JSON.parse(sessionStorage.getItem("vooParaEditar"));
if (!voo) {
  alert("Nenhum voo selecionado para edição.");
  window.location.href = "/html/listagem/voos.html";
}

window.addEventListener("DOMContentLoaded", () => {
  for (const key in voo) {
    const input = document.getElementById(key);
    if (input) input.value = voo[key];
  }
});

document.getElementById('form-editar-voo').addEventListener('submit', async (e) => {
  e.preventDefault();

  const campos = [
    "origem", "destino", "dataIda", "dataVolta", "horaPartida", "horaChegada",
    "assentosDisponiveis", "preco", "paradas", "duracao", "ciaAerea",
    "numeroVoo", "classe", "aeroportoOrigem", "aeroportoDestino"
  ];
  const vooEditado = {};
  campos.forEach(campo => {
    const input = document.getElementById(campo);
    vooEditado[campo] = input.type === "number" ? Number(input.value) : input.value;
  });

  await voosService.atualizarVoo(voo.id, vooEditado);
  alert("Voo atualizado com sucesso!");
  window.location.href = "/html/listagem/voos.html";
});