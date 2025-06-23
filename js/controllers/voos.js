import * as voosService from '../services/voosService.js';
import * as carrinhoService from '../services/carrinhoService.js';

function getUsuarioLogado() {
  const usuario = sessionStorage.getItem("usuarioLogado");
  return usuario ? JSON.parse(usuario) : null;
}

const usuarioLogado = getUsuarioLogado();
const isAdmin = usuarioLogado && usuarioLogado.role === "admin";

const container = document.getElementById("voos-container");

let dadosVoos = [];
document.addEventListener("DOMContentLoaded", async () => {
  const filtros = JSON.parse(localStorage.getItem('filtrosViagem') || '{}');  

  try {
    dadosVoos = await voosService.listarVoos();
    console.log("Todos os voos do Firebase:", dadosVoos);

    if(Object.keys(filtros).length !== 0){
      if(filtros.origem !== ""){
        dadosVoos = filtrarVoosPorOrigem(dadosVoos, filtros.origem);
      }
      if(filtros.destino !== ""){
        dadosVoos = filtrarVoosPorDestino(dadosVoos, filtros.destino);
      }
      if(filtros.dataIda !== ""){
        dadosVoos = filtrarVoosPorDataIda(dadosVoos, filtros.dataIda);
      }
      if(filtros.dataVolta !== ""){
        dadosVoos = filtrarVoosPorDataVolta(dadosVoos, filtros.dataVolta);
      }
      if(filtros.passageiros !== ""){
        dadosVoos = filtrarVoosPorPassageiros(dadosVoos, filtros.passageiros);
      }
    }
    renderizarVoos(dadosVoos, filtros.passageiros);
  } catch (err) {
    console.error("Erro ao carregar voos do Firebase:", err);
    container.innerHTML = "<p class='text-center'>Erro ao carregar voos.</p>";
  }

  const formFiltros = document.getElementById('form-filtros');
  formFiltros.addEventListener('submit', function(event){
    event.preventDefault();
    container.innerHTML = "";

    const filtros = coletarDadosFormFiltros();
    const erroPreco = validarPrecosForm(filtros.precoMin, filtros.precoMax);
    if(erroPreco == 1){
      return;
    }
    
    let voosFiltrados = [...dadosVoos];

    if (filtros.paradas !== "") {
      voosFiltrados = filtrarVoosPorParadas(voosFiltrados, filtros.paradas);
    }
    if (filtros.precoMin !== "") {
      voosFiltrados = filtrarVoosPorPrecoMin(voosFiltrados, filtros.precoMin);
    }
    if (filtros.precoMax !== "") {
      voosFiltrados = filtrarVoosPorPrecoMax(voosFiltrados, filtros.precoMax);
    }
    if (filtros.ordenacao == "precoAsc"){
      ordenarVoosPorPrecoCrescente(voosFiltrados);
    }
    else if (filtros.ordenacao == "precoDesc"){
      ordenarVoosPorPrecoDecrescente(voosFiltrados);
    }
    renderizarVoos(voosFiltrados, filtros.passageiros);
  });
});


function criarCard(voo, index, passageiros) {
  let numPassageiros = parseInt(passageiros);
  if (isNaN(numPassageiros) || numPassageiros < 1) numPassageiros = 1;

  const card = document.createElement("div");
  card.className = "card mb-4 shadow-sm";

  card.innerHTML = `
    <div class="card-body">
      <h5 class="card-title mb-3">
        ${voo.origem} → ${voo.destino}
      </h5>
      <p class="card-text">
        <strong>Companhia:</strong> ${voo.ciaAerea} <br>
        <strong>Classe:</strong> ${voo.classe} <br>
        <strong>Ida:</strong> ${voo.dataIda} às ${voo.horaPartida} <br>
        <strong>Volta:</strong> ${voo.dataVolta} às ${voo.horaChegada} <br>
        <strong>Duração:</strong> ${voo.duracao} <br>
        <strong>Paradas:</strong> ${voo.paradas === 0 ? "Direto" : voo.paradas === 1 ? "1 parada" : `${voo.paradas} paradas`} <br>
        <strong>Preço por passageiro:</strong> R$ ${voo.preco.toFixed(2)}<br>
        <strong>Total (${numPassageiros}x):</strong> <span class="text-success fw-bold">R$ ${(voo.preco * numPassageiros).toFixed(2)}</span>
      </p>
      <div class="d-flex justify-content-between align-items-center">
        <a href="#" class="btn btn-primary" data-id="${voo.id}" data-passageiros="${numPassageiros}">Selecionar</a>
        ${isAdmin ? `
          <div>
            <button class="btn btn-warning btn-sm me-2 btn-editar" data-id="${voo.id}">Editar</button>
            <button class="btn btn-danger btn-sm btn-deletar" data-id="${voo.id}">Deletar</button>
          </div>
        ` : ""}
      </div>
    </div>
  `;

  card.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    console.log(`Selecionando voo ${voo.id} para ${numPassageiros} passageiro(s)`);
    adicionarAoCarrinho(voo, numPassageiros);
    adicionarAoCarrinho(voo, numPassageiros).then(() => {
      window.location.href = "conta.html";
    });
  });

  // Botão Editar (apenas admin)
  if (isAdmin) {
    card.querySelector(".btn-editar").addEventListener("click", async (e) => {
      e.preventDefault();
      // Salva o voo no sessionStorage para edição
      sessionStorage.setItem("vooParaEditar", JSON.stringify(voo));
      window.location.href = "editar-voo.html";
    });

    // Botão Deletar (apenas admin)
    card.querySelector(".btn-deletar").addEventListener("click", async (e) => {
      e.preventDefault();
      if (confirm("Tem certeza que deseja deletar este voo?")) {
        await voosService.deletarVoo(voo.id);
        alert("Voo deletado com sucesso!");
        location.reload();
      }
    });
  }

  return card;
}

function renderizarVoos(listaDeVoos,passageiros) {
  const container = document.getElementById("voos-container");
  container.innerHTML = "";

  if (listaDeVoos.length === 0) {
    container.innerHTML = "<p class='text-center'>Nenhum voo encontrado com os filtros selecionados.</p>";
    return;
  }

  listaDeVoos.forEach((voo, index) => {
    const card = criarCard(voo, index, passageiros);
    container.appendChild(card);
  });
}

function coletarDadosFormFiltros(){
  const paradas = document.querySelector('input[name="filtro-paradas"]:checked')?.value;
  const precoMin = document.getElementById('preco-min').value;
  const precoMax = document.getElementById('preco-max').value;
  const ordenacao = document.getElementById('ordem').value;

  return{
    paradas,
    precoMin,
    precoMax,
    ordenacao
  }
}

function validarPrecosForm(precoMin, precoMax){
  if(precoMin !== "" && precoMax !== ""){
    if(precoMin>precoMax){
      alert("O preço minimo tem que ser menor que o preço máximo");
      return 1;
    }
  }else if(precoMin !== ""){
    if(precoMin<=0){
      alert("O preço minimo tem que ser maior que zero");
      return 1;
    }
  }


}

function filtrarVoosPorParadas(listaDeVoos, paradas){
  const listaFiltrada = listaDeVoos.filter(voo => parseInt(voo.paradas) == parseInt(paradas));
  return listaFiltrada;
}

function filtrarVoosPorPrecoMin(listaDeVoos, precoMin){
  const listaFiltrada = listaDeVoos.filter(voo => parseInt(voo.preco) >= parseInt(precoMin));
  return listaFiltrada;
}

function filtrarVoosPorPrecoMax(listaDeVoos, precoMax){
  const listaFiltrada = listaDeVoos.filter(voo => parseInt(voo.preco) <= parseInt(precoMax));
  return listaFiltrada;
}

function ordenarVoosPorPrecoCrescente(listaDeVoos){
  const listaOrdenada = listaDeVoos.sort((a,b) => a.preco - b.preco);
  return listaOrdenada;
}

function ordenarVoosPorPrecoDecrescente(listaDeVoos){
  const listaOrdenada = listaDeVoos.sort((a,b) => b.preco - a.preco);
  return listaOrdenada;
}

function filtrarVoosPorOrigem(listaDeVoos, origem){
  return listaDeVoos.filter(voo => voo.origem.toLowerCase().includes(origem.toLowerCase()));
}

function filtrarVoosPorDestino(listaDeVoos, destino){
  return listaDeVoos.filter(voo => voo.destino.toLowerCase().includes(destino.toLowerCase()));
}

function filtrarVoosPorDataIda(listaDeVoos, dataIda){
  return listaDeVoos.filter(voo => voo.dataIda == dataIda);
}

function filtrarVoosPorDataVolta(listaDeVoos, dataVolta){
  return listaDeVoos.filter(voo => voo.dataVolta == dataVolta);
}

function filtrarVoosPorPassageiros(listaDeVoos, passageiros){
  return listaDeVoos.filter(voo => voo.assentosDisponiveis >= passageiros);
}

function limparFiltro(){
  localStorage.removeItem('filtrosViagem');
  location.reload();
}
document.getElementById('limpar-filtros').addEventListener('click', limparFiltro);

async function adicionarAoCarrinho(voo, quantidadePassageiros) {
  const usuario = getUsuarioLogado();
  if (!usuario) {
    alert("Você precisa estar logado para adicionar ao carrinho.");
    window.location.href = "login.html";
    return;
  }

  try {
    // Busca o carrinho atual do Firebase
    let carrinho = await carrinhoService.obterCarrinho(usuario.email);
    if (!Array.isArray(carrinho)) carrinho = [];

    // Evita duplicidade do mesmo voo
    if (carrinho.some(item => item.vooId === voo.id)) {
      alert("Este voo já está no seu carrinho.");
      return;
    }

    // Adiciona o voo ao carrinho (mesma estrutura das hospedagens)
    carrinho.push({
      vooId: voo.id,
      origem: voo.origem,
      destino: voo.destino,
      ciaAerea: voo.ciaAerea,
      dataIda: voo.dataIda,
      dataVolta: voo.dataVolta,
      horaPartida: voo.horaPartida,
      horaChegada: voo.horaChegada,
      preco: voo.preco,
      quantidadePassageiros,
      dataReserva: new Date().toISOString()
    });

    // Salva no Firebase
    await carrinhoService.salvarCarrinho(usuario.email, carrinho);

    // (Opcional) Atualiza localStorage para acesso rápido
    localStorage.setItem(`carrinho_${usuario.email}`, JSON.stringify(carrinho));


  } catch (err) {
    alert("Erro ao adicionar voo ao carrinho: " + err.message);
    console.error(err);
  }
}

// Exemplo de uso ao clicar no botão de adicionar ao carrinho:
function configurarBotoesAdicionar() {
  document.querySelectorAll('.btn-adicionar-carrinho').forEach(btn => {
    btn.addEventListener('click', async function() {
      const vooId = this.dataset.vooId;
      const quantidadePassageiros = parseInt(this.dataset.passageiros) || 1;
      const voo = dadosVoos.find(v => v.id === vooId);
      if (voo) {
        await adicionarAoCarrinho(voo, quantidadePassageiros);
      }
    });
  });
}

// Chame configurarBotoesAdicionar() após renderizar os cards de voos, se necessário


