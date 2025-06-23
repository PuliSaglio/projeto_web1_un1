import * as hospedagensService from '../services/hospedagensService.js';

function getUsuarioLogado() {
  const usuario = sessionStorage.getItem("usuarioLogado");
  return usuario ? JSON.parse(usuario) : null;
}

const usuario = getUsuarioLogado();
if (!usuario || usuario.role !== "admin") {
  window.location.href = "login.html";
  throw new Error("Acesso negado: apenas administradores podem acessar esta página.");
}

document.getElementById('form-cadastro-hospedagem').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Coleta dos campos simples
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

  // Monta o objeto conforme o modelo
  const hospedagem = {
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
    await hospedagensService.adicionarHospedagem(hospedagem);
    mensagemDiv.textContent = 'Hospedagem cadastrada com sucesso!';
    mensagemDiv.className = 'alert alert-success';
    document.getElementById('form-cadastro-hospedagem').reset();
  } catch (error) {
    mensagemDiv.textContent = 'Erro ao cadastrar hospedagem. Tente novamente.';
    mensagemDiv.className = 'alert alert-danger';
  }
});