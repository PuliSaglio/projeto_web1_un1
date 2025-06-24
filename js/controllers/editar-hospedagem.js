import * as hospedagensService from '../services/hospedagensService.js';

function getUsuarioLogado() {
  const usuario = sessionStorage.getItem("usuarioLogado");
  return usuario ? JSON.parse(usuario) : null;
}

const usuario = getUsuarioLogado();
if (!usuario || usuario.role !== "admin") {
  window.location.href = "/html/login.html";
  throw new Error("Acesso negado: apenas administradores podem acessar esta página.");
}

const hospedagem = JSON.parse(sessionStorage.getItem("hospedagemParaEditar"));
if (!hospedagem) {
  alert("Nenhuma hospedagem selecionada para edição.");
  window.location.href = "/html/listagem/hospedagens.html";
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById('nome').value = hospedagem.nome || '';
  document.getElementById('endereco').value = hospedagem.endereco || '';
  document.getElementById('cidade').value = hospedagem.localizacao?.cidade || '';
  document.getElementById('estado').value = hospedagem.localizacao?.estado || '';
  document.getElementById('pais').value = hospedagem.localizacao?.pais || '';
  document.getElementById('precoPorNoite').value = hospedagem.precoPorNoite || '';
  document.getElementById('capacidadePorQuarto').value = hospedagem.capacidadePorQuarto || '';
  document.getElementById('quartosDisponiveis').value = hospedagem.quartosDisponiveis || '';
  document.getElementById('checkin').value = hospedagem.disponibilidade?.checkin || '';
  document.getElementById('checkout').value = hospedagem.disponibilidade?.checkout || '';
  document.getElementById('avaliacao').value = hospedagem.avaliacao || '';
  document.getElementById('quantidadeEstrelas').value = hospedagem.quantidadeEstrelas || '';
  document.getElementById('comodidades').value = Array.isArray(hospedagem.comodidades) ? hospedagem.comodidades.join(', ') : '';
  document.getElementById('fotos').value = Array.isArray(hospedagem.fotos) ? hospedagem.fotos.join(', ') : '';
  document.getElementById('descricao').value = hospedagem.descricao || '';
});

document.getElementById('form-editar-hospedagem').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const cidade = document.getElementById('cidade').value.trim();
  const estado = document.getElementById('estado').value.trim();
  const pais = document.getElementById('pais').value.trim();
  const precoPorNoite = parseFloat(document.getElementById('precoPorNoite').value);
  const capacidadePorQuarto = parseInt(document.getElementById('capacidadePorQuarto').value);
  const quartosDisponiveis = parseInt(document.getElementById('quartosDisponiveis').value);
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const avaliacao = parseFloat(document.getElementById('avaliacao').value);
  const quantidadeEstrelas = parseInt(document.getElementById('quantidadeEstrelas').value);
  const comodidades = document.getElementById('comodidades').value
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0);
  const fotos = document.getElementById('fotos').value
    .split(',')
    .map(f => f.trim())
    .filter(f => f.length > 0);
  const descricao = document.getElementById('descricao').value.trim();

  const hospedagemEditada = {
    nome,
    localizacao: {
      cidade,
      estado,
      pais
    },
    endereco,
    precoPorNoite,
    capacidadePorQuarto,
    quartosDisponiveis,
    disponibilidade: {
      checkin,
      checkout
    },
    avaliacao,
    quantidadeEstrelas,
    comodidades,
    fotos,
    descricao
  };

  const mensagemDiv = document.getElementById('mensagem');
  mensagemDiv.textContent = '';
  mensagemDiv.className = '';

  try {
    await hospedagensService.atualizarHospedagem(hospedagem.id, hospedagemEditada);
    mensagemDiv.textContent = 'Hospedagem atualizada com sucesso!';
    mensagemDiv.className = 'alert alert-success';
    setTimeout(() => {
      window.location.href = "/html/listagem/hospedagens.html";
    }, 1200);
  } catch (error) {
    mensagemDiv.textContent = 'Erro ao atualizar hospedagem. Tente novamente.';
    mensagemDiv.className = 'alert alert-danger';
  }
});