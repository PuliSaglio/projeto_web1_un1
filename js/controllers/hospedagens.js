import * as hospedagensService from '../services/hospedagensService.js';

let dadosHospedagens = [];
const botaoFiltro = document.getElementById('aplica-filtro')

function getUsuarioLogado() {
  const usuario = sessionStorage.getItem("usuarioLogado");
  return usuario ? JSON.parse(usuario) : null;
}

const usuarioLogado = getUsuarioLogado();
const isAdmin = usuarioLogado && usuarioLogado.role === "admin";

async function carregarHospedagens() {
  const filtros = JSON.parse(localStorage.getItem('filtrosHospedagem') || '{}')

  const hospedagens = await hospedagensService.listarHospedagens();
  dadosHospedagens = hospedagens;
  renderizarHospedagens(hospedagens);

  if (Object.keys(filtros).length !== 0) {
      if (filtros.destino !== "") {
      dadosHospedagens = filtrarHospedagensPorCidade(dadosHospedagens, filtros.destino);
      console.log(filtros.destino);
      console.log("Filtrado por cidade:", dadosHospedagens);
      }
      if (filtros.checkin && filtros.checkout) {
      dadosHospedagens = filtrarHospedagensPorData(dadosHospedagens, filtros.checkin, filtros.checkout);
      console.log("Filtrado por data:", dadosHospedagens);
      }
      if (filtros.hospedes !== "") {
      dadosHospedagens = filtrarHospedagensPorCapacidade(dadosHospedagens, filtros.hospedes);
      console.log("Filtrado por capacidade:", dadosHospedagens);
      }
  }

  console.log("Hospedagens filtradas finais:", dadosHospedagens);
  renderizarHospedagens(dadosHospedagens);
}

document.addEventListener("DOMContentLoaded", () => {
  carregarHospedagens().catch(err => console.error("Erro ao carregar hospedagens:", err));
});

botaoFiltro.addEventListener('click', function(){
  aplicarFiltros(coletarDadosFormFiltros());
})

function renderizarHospedagens(lista) {
    const container = document.getElementById("hospedagens-container");
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p class='text-muted'>Nenhuma hospedagem encontrada com esses critérios.</p>";
        return;
    }

    for (const hotel of lista) {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        const estrelas = "⭐".repeat(hotel.quantidadeEstrelas);

        col.innerHTML = `
            <div class="card card-hotel shadow-sm">
                <img src="${hotel.fotos}" class="card-img-top" alt="${hotel.nome}">
                <div class="card-body">
                    <h5 class="card-title">${hotel.nome}</h5>
                    <p class="card-text text-muted">${hotel.localizacao.cidade}, ${hotel.localizacao.estado}</p>
                    <p class="mb-1"><strong>Preço:</strong> R$ ${hotel.precoPorNoite.toFixed(2)} / noite</p>
                    <p class="mb-2">${estrelas}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <a href="#" class="btn btn-outline-primary btn-sm w-100 btn-selecionar-hotel">Selecionar</a>
                    </div>
                    ${isAdmin ? `
                        <div class="d-flex justify-content-between pt-3">
                            <button class="btn btn-warning btn-sm btn-editar-hotel" data-id="${hotel.id}">Editar</button>
                            <button class="btn btn-danger btn-sm btn-deletar-hotel" data-id="${hotel.id}">Deletar</button>
                        </div>
                        ` : ""}
                </div>
            </div>
        `;

        const btnSelecionar = col.querySelector('.btn-selecionar-hotel');
        btnSelecionar.addEventListener('click', (e) => {
            e.preventDefault();
            verDetalhes(hotel.id);
        });

        if (isAdmin) {
            col.querySelector('.btn-editar-hotel').addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.setItem("hospedagemParaEditar", JSON.stringify(hotel));
                window.location.href = "/html/edicao/editar-hospedagem.html";
            });

            col.querySelector('.btn-deletar-hotel').addEventListener('click', async (e) => {
                e.preventDefault();
                if (confirm("Tem certeza que deseja deletar esta hospedagem?")) {
                    await hospedagensService.deletarHospedagem(hotel.id);
                    alert("Hospedagem deletada com sucesso!");
                    window.location.reload();
                }
            });
        }

        container.appendChild(col);
    }
}

function coletarDadosFormFiltros(){
    const cidade = document.getElementById("filtro-cidade").value.toLowerCase();
    const precoMax = parseFloat(document.getElementById("filtro-preco").value);
    const estrelasMin = parseInt(document.getElementById("filtro-estrelas").value);

    return{
        cidade,
        precoMax,
        estrelasMin
    }
}

function aplicarFiltros(dadosFiltros) {
  let resultado = [...dadosHospedagens];

  if (dadosFiltros.cidade) resultado = filtrarHospedagensPorCidade(resultado, dadosFiltros.cidade);
  if (!isNaN(dadosFiltros.precoMax)) resultado = filtrarHospedagensPorPreco(resultado, dadosFiltros.precoMax);
  if (!isNaN(dadosFiltros.estrelasMin)) resultado = filtrarHospedagensPorEstrelas(resultado, dadosFiltros.estrelasMin);

  renderizarHospedagens(resultado);
}


function filtrarHospedagensPorCidade(hospedagens, cidade){
    return hospedagens.filter(h => h.localizacao.cidade.toLowerCase().includes(cidade.toLowerCase()));
}

function filtrarHospedagensPorPreco(hospedagens, precoMax){
    return hospedagens.filter(h => h.precoPorNoite <= precoMax);
}

function filtrarHospedagensPorEstrelas(hospedagens, estrelasMin){
    return hospedagens.filter(h => h.quantidadeEstrelas >= estrelasMin);
}

function filtrarHospedagensPorData(hospedagens, checkinDesejado, checkoutDesejado) {
  if (!checkinDesejado || !checkoutDesejado) return hospedagens;

  const checkinUser = new Date(checkinDesejado);
  const checkoutUser = new Date(checkoutDesejado);

  return hospedagens.filter(h => {
    const hotelCheckin = new Date(h.disponibilidade.checkin);
    const hotelCheckout = new Date(h.disponibilidade.checkout);
    return checkinUser >= hotelCheckin && checkoutUser <= hotelCheckout;
  });
}

function filtrarHospedagensPorCapacidade(hospedagens, numeroHospedes) {
  if (!numeroHospedes || numeroHospedes < 1) return hospedagens;

  return hospedagens.filter(h => {
    const capacidadeTotal = h.capacidadePorQuarto * h.quartosDisponiveis;
    return numeroHospedes <= capacidadeTotal;
  });
}

function verDetalhes(hospedagemId) {
  const hospedagem = dadosHospedagens.find(h => h.id === hospedagemId);
  if (hospedagem) {
    sessionStorage.setItem("hospedagemSelecionada", JSON.stringify(hospedagem));
    window.location.href = "/html/listagem/detalhes-hospedagem.html";
  } else {
    alert("Hospedagem não encontrada.");
  }
}

function limparFiltro(){
  localStorage.removeItem('filtrosHospedagem');
  location.reload();
}

document.getElementById('limpar-filtros').addEventListener('click', limparFiltro);

const PEXELS_API_KEY = "h5gy6naTXcrk50QVQoQL6FryDRdy02EmkJQzLmzlqqX156ceY2rxOQuo";

async function buscarImagemDoPexels(query) {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
        headers: {
            Authorization: PEXELS_API_KEY
        }
    });

    const data = await response.json();
    return data.photos?.[0]?.src?.medium || "https://via.placeholder.com/400x300?text=Imagem+indisponível";
}

// Adicionar ao carrinho
function adicionarAoCarrinho(hospedagemId) {
  const usuario = getUsuarioLogado();
  if (!usuario) {
    alert("Faça login para adicionar ao carrinho.");
    return;
  }
  const chaveCarrinho = `carrinho_${usuario.email}`;
  const carrinho = JSON.parse(localStorage.getItem(chaveCarrinho)) || [];
  if (carrinho.some(item => item.hospedagemId === hospedagemId)) {
    alert("Esta hospedagem já está no seu carrinho.");
    return;
  }
  carrinho.push({ hospedagemId });
  localStorage.setItem(chaveCarrinho, JSON.stringify(carrinho));
  alert("Hospedagem adicionada ao carrinho!");
}