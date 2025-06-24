import * as pacotesService from '../services/pacotesService.js';
import * as voosService from '../services/voosService.js';
import * as hospedagensService from '../services/hospedagensService.js';

// Função utilitária para obter usuário logado
function getUsuarioLogado() {
  const usuario = sessionStorage.getItem("usuarioLogado");
  return usuario ? JSON.parse(usuario) : null;
}

// Permissão apenas para admin
const usuario = getUsuarioLogado();
if (!usuario || usuario.role !== "admin") {
  window.location.href = "/html/login.html";
  throw new Error("Acesso negado: apenas administradores podem acessar esta página.");
}

// Recupera pacote selecionado para edição
const pacote = JSON.parse(sessionStorage.getItem("pacoteParaEditar"));
if (!pacote) {
  alert("Nenhum pacote selecionado para edição.");
  window.location.href = "/html/listagem/pacotes.html";
}

// Preenche campos do formulário com dados do pacote
window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById('nome').value = pacote.nome || '';
  document.getElementById('preco').value = pacote.preco || '';
  document.getElementById('descricao').value = pacote.descricao || '';
  document.getElementById('fotos').value = Array.isArray(pacote.fotos) ? pacote.fotos.join(', ') : '';

  // Preencher opções de voos
  const voos = await voosService.listarVoos();
  const vooSelect = document.getElementById('vooId');
  voos.forEach(voo => {
    const opt = document.createElement('option');
    opt.value = voo.id;
    opt.textContent = `${voo.origem} → ${voo.destino} (${voo.ciaAerea})`;
    if (voo.id === pacote.vooId) opt.selected = true;
    vooSelect.appendChild(opt);
  });

  // Preencher opções de hospedagens
  const hospedagens = await hospedagensService.listarHospedagens();
  const hospedagemSelect = document.getElementById('hospedagemId');
  hospedagens.forEach(hosp => {
    const opt = document.createElement('option');
    opt.value = hosp.id;
    opt.textContent = `${hosp.nome} - ${hosp.localizacao?.cidade || ''}`;
    if (hosp.id === pacote.hospedagemId) opt.selected = true;
    hospedagemSelect.appendChild(opt);
  });
});

// Lida com o envio do formulário de edição
document.getElementById('form-editar-pacote').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);
  const descricao = document.getElementById('descricao').value.trim();
  const vooId = document.getElementById('vooId').value;
  const hospedagemId = document.getElementById('hospedagemId').value;
  const fotos = document.getElementById('fotos').value
    .split(',')
    .map(f => f.trim())
    .filter(f => f.length > 0);

  const pacoteEditado = {
    nome,
    preco,
    descricao,
    vooId,
    hospedagemId,
    fotos
  };

  const mensagemDiv = document.getElementById('mensagem');
  mensagemDiv.textContent = '';
  mensagemDiv.className = '';

  try {
    await pacotesService.atualizarPacote(pacote.id, pacoteEditado);
    mensagemDiv.textContent = 'Pacote atualizado com sucesso!';
    mensagemDiv.className = 'alert alert-success';
    setTimeout(() => {
      window.location.href = "/html/listagem/pacotes.html";
    }, 1200);
  } catch (error) {
    mensagemDiv.textContent = 'Erro ao atualizar pacote. Tente novamente.';
    mensagemDiv.className = 'alert alert-danger';
  }
});