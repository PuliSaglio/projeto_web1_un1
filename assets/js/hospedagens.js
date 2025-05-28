let dadosHospedagens = [];
const botaoFiltro = document.getElementById('aplica-filtro')

document.addEventListener("DOMContentLoaded", () => {
    const filtros = JSON.parse(localStorage.getItem('filtrosHospedagem') || '{}')

    fetch('./data/hospedagens.json')
    .then(response => response.json())
    .then(data => {
    dadosHospedagens = data;
    console.log("Todas as hospedagens:", dadosHospedagens);

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
    })
    .catch(err => console.error("Erro ao carregar hospedagens:", err));
});

botaoFiltro.addEventListener('click', function(){
  aplicarFiltros(coletarDadosFormFiltros());
})

async function renderizarHospedagens(lista) {
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

        const imagemUrl = await buscarImagemDoPexels(hotel.nome || "hotel resort");

        col.innerHTML = `
            <div class="card card-hotel shadow-sm">
                <img src="${imagemUrl}" class="card-img-top" alt="${hotel.nome}">
                <div class="card-body">
                    <h5 class="card-title">${hotel.nome}</h5>
                    <p class="card-text text-muted">${hotel.localizacao.cidade}, ${hotel.localizacao.estado}</p>
                    <p class="mb-1"><strong>Preço:</strong> R$ ${hotel.precoPorNoite.toFixed(2)} / noite</p>
                    <p class="mb-2">${estrelas}</p>
                    <a href="#" class="btn btn-outline-primary btn-sm w-100" onclick='verDetalhes(${JSON.stringify(hotel)})'>Selecionar</a>
                </div>
            </div>
        `;

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

 
  // const checkin = document.getElementById("filtro-checkin").value;
  // const checkout = document.getElementById("filtro-checkout").value;
  // const hospedes = parseInt(document.getElementById("filtro-hospedes").value);

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

function verDetalhes(hospedagem) {
  sessionStorage.setItem("hospedagemSelecionada", JSON.stringify(hospedagem));
  window.location.href = "detalhes-hospedagem.html";
}

function limparFiltro(){
  localStorage.removeItem('filtrosHospedagem');
  location.reload();
}

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