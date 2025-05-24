document.addEventListener("DOMContentLoaded", () => {
  fetch('./data/voos.json')
    .then(response => response.json())
    .then(data => {
      renderizarVoos(data);
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
