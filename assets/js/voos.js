const container = document.getElementById("voos-container");

document.addEventListener("DOMContentLoaded", () => {
  let dadosVoos = [];
  

  fetch('./data/voos.json')
    .then(response => response.json())
    .then(data => {
      dadosVoos = data;
      renderizarVoos(dadosVoos);
  });

  const formFiltros = document.getElementById('form-filtros');

  formFiltros.addEventListener('submit', function(event){
    event.preventDefault();
    container.innerHTML = "";

    const filtros = coletarDadosFormFiltros();

    let voosFiltrados = dadosVoos;
    

    if (filtros.paradas !== "") {
      voosFiltrados = filtrarVoosPorParadas(voosFiltrados, filtros.paradas);
      console.log(voosFiltrados);
    }

    if (filtros.precoMin !== "") {
      voosFiltrados = filtrarVoosPorPrecoMin(voosFiltrados, filtros.precoMin);
      console.log(voosFiltrados);
    }

    if (filtros.precoMax !== "") {
      voosFiltrados = filtrarVoosPorPrecoMax(voosFiltrados, filtros.precoMax);
      console.log(voosFiltrados);
    }

    if (filtros.ordenacao == "precoAsc"){
      ordenarVoosPorPrecoCrescente(voosFiltrados);
    }
    else if (filtros.ordenacao == "precoDesc"){
      ordenarVoosPorPrecoDecrescente(voosFiltrados);
    }

    renderizarVoos(voosFiltrados);
  });


});


function criarCard(voo) {
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
        <strong>Passageiros:</strong> ${voo.numeroPassageiros}
      </p>
      <div class="d-flex justify-content-between align-items-center">
        <span class="fs-5 fw-bold text-success">R$ ${voo.preco.toFixed(2)}</span>
        <a href="#" class="btn btn-primary">Selecionar</a>
      </div>
    </div>
  `;

  return card;
}

function renderizarVoos(listaDeVoos) {
  const container = document.getElementById("voos-container");
  container.innerHTML = "";

  if (listaDeVoos.length === 0) {
    container.innerHTML = "<p class='text-center'>Nenhum voo encontrado com os filtros selecionados.</p>";
    return;
  }

  listaDeVoos.forEach(voo => {
    const card = criarCard(voo);
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