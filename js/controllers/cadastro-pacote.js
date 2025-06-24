import * as pacotesService from '../services/pacotesService.js';
import * as voosService from '../services/voosService.js';
import * as hospedagensService from '../services/hospedagensService.js';

document.addEventListener("DOMContentLoaded", async () => {
  // Preencha selects de voos e hospedagens
  const voos = await voosService.listarVoos();
  const hospedagens = await hospedagensService.listarHospedagens();
  const selectVoo = document.getElementById("vooId");
  const selectHosp = document.getElementById("hospedagemId");
  voos.forEach(v => selectVoo.innerHTML += `<option value="${v.id}">${v.origem} → ${v.destino} (${v.numeroVoo})</option>`);
  hospedagens.forEach(h => selectHosp.innerHTML += `<option value="${h.id}">${h.nome} (${h.localizacao.cidade})</option>`);
});

document.getElementById("form-cadastro-pacote").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const preco = parseFloat(document.getElementById("preco").value);
  const vooId = document.getElementById("vooId").value;
  const hospedagemId = document.getElementById("hospedagemId").value;
  const fotos = document.getElementById("fotos").value.split(',').map(f => f.trim()).filter(f => f);

  await pacotesService.adicionarPacote({ nome, descricao, preco, vooId, hospedagemId, fotos });
  alert("Pacote cadastrado com sucesso!");
  window.location.href = "/html/listagem/pacotes.html";
});