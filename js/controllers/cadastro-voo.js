function getUsuarioLogado() {
  const usuario = sessionStorage.getItem("usuarioLogado");
  return usuario ? JSON.parse(usuario) : null;
}

const usuario = getUsuarioLogado();
if (!usuario || usuario.role !== "admin") {
  window.location.href = "/html/login.html";
  throw new Error("Acesso negado: apenas administradores podem acessar esta página.");
}

import * as voosService from '../services/voosService.js';

document.getElementById('form-cadastro-voo').addEventListener('submit', async (e) => {
  e.preventDefault();

  const origem = document.getElementById('origem').value.trim();
  const destino = document.getElementById('destino').value.trim();
  const dataIda = document.getElementById('dataIda').value;
  const dataVolta = document.getElementById('dataVolta').value;
  const horaPartida = document.getElementById('horaPartida').value;
  const horaChegada = document.getElementById('horaChegada').value;
  const assentosDisponiveis = parseInt(document.getElementById('assentosDisponiveis').value);
  const preco = parseFloat(document.getElementById('preco').value);
  const paradas = parseInt(document.getElementById('paradas').value);
  const duracao = document.getElementById('duracao').value.trim();
  const ciaAerea = document.getElementById('ciaAerea').value.trim();
  const numeroVoo = document.getElementById('numeroVoo').value.trim();
  const classe = document.getElementById('classe').value.trim();
  const aeroportoOrigem = document.getElementById('aeroportoOrigem').value.trim();
  const aeroportoDestino = document.getElementById('aeroportoDestino').value.trim();

  const voo = {
    origem,
    destino,
    dataIda,
    dataVolta,
    horaPartida,
    horaChegada,
    assentosDisponiveis,
    preco,
    paradas,
    duracao,
    ciaAerea,
    numeroVoo,
    classe,
    aeroportoOrigem,
    aeroportoDestino
  };

  const mensagemDiv = document.getElementById('mensagem');
  mensagemDiv.textContent = '';
  mensagemDiv.className = '';

  try {
    await voosService.adicionarVoo(voo);
    mensagemDiv.textContent = 'Voo cadastrado com sucesso!';
    mensagemDiv.className = 'alert alert-success';
    document.getElementById('form-cadastro-voo').reset();
  } catch (error) {
    mensagemDiv.textContent = 'Erro ao cadastrar voo. Tente novamente.';
    mensagemDiv.className = 'alert alert-danger';
  }
});