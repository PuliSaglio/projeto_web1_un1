document.addEventListener("DOMContentLoaded", function(){
    carregarCarrinho();
    carregarPassagens();
    carregarReservas();
});

function getUsuarioLogado() {
    return JSON.parse(sessionStorage.getItem('usuarioLogado'));
}

function carregarCarrinho() {
  const usuario = getUsuarioLogado();
  const chave = `carrinho_${usuario.email}`;
  const carrinho = JSON.parse(localStorage.getItem(chave)) || [];

  const container = document.getElementById("carrinho-container");
  container.innerHTML = "";

  const voos = carrinho.filter(item => item.origem && item.destino);
  const hospedagens = carrinho.filter(item => item.localizacao);

  if (voos.length === 0 && hospedagens.length === 0) {
    container.innerHTML = "<p class='text-muted'>Seu carrinho está vazio.</p>";
    return;
  }

  if (voos.length > 0) {
    const voosHeader = document.createElement("h5");
    voosHeader.textContent = "Voos Selecionados";
    container.appendChild(voosHeader);

    voos.forEach((voo, index) => {
      const precoTotal = voo.preco * (voo.quantidadePassageiros || 1);

      const card = document.createElement("div");
      card.className = "card card-voo mb-3";

      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${voo.origem} → ${voo.destino}</h5>
          <p class="card-text">
            <strong>Companhia:</strong> ${voo.ciaAerea}<br>
            <strong>Passageiros:</strong> ${voo.quantidadePassageiros}<br>
            <strong>Preço por pessoa:</strong> R$ ${voo.preco.toFixed(2)}<br>
            <strong>Total:</strong> <span class="text-success">R$ ${precoTotal.toFixed(2)}</span>
          </p>
          <button class="btn btn-sm btn-outline-danger" onclick="removerDoCarrinho(${index})">Remover</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  if (hospedagens.length > 0) {
    const hospHeader = document.createElement("h5");
    hospHeader.textContent = "Hospedagens Selecionadas";
    hospHeader.className = "mt-4";
    container.appendChild(hospHeader);

    hospedagens.forEach((hospedagem, index) => {
      const card = document.createElement("div");
      card.className = "card card-hospedagem mb-3";

      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${hospedagem.nome}</h5>
          <p class="card-text">
            <strong>Local:</strong> ${hospedagem.localizacao.cidade}, ${hospedagem.localizacao.estado}<br>
            <strong>Check-in:</strong> ${hospedagem.checkin}<br>
            <strong>Check-out:</strong> ${hospedagem.checkout}<br>
            <strong>Noites:</strong> ${hospedagem.noites}<br>
            <strong>Hóspedes:</strong> ${hospedagem.quantidadeHospedes}<br>
            <strong>Total:</strong> <span class="text-success">R$ ${hospedagem.precoTotal.toFixed(2)}</span>
          </p>
          <button class="btn btn-sm btn-outline-danger" onclick="removerDoCarrinho(${index})">Remover</button>
        </div>
      `;

      container.appendChild(card);
    });
  }
}

function removerDoCarrinho(index) {
    const usuario = getUsuarioLogado();
    const chave = `carrinho_${usuario.email}`;
    const carrinho = JSON.parse(localStorage.getItem(chave)) || [];

    carrinho.splice(index, 1);
    localStorage.setItem(chave, JSON.stringify(carrinho));
    carregarCarrinho();
}

function finalizarCompra() {
    alert("Compra finalizada com sucesso!");
    const usuario = getUsuarioLogado();
    const chave = `carrinho_${usuario.email}`;
    window.location.href = 'finalizar-compra.html';
}

function logout() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = "index.html";
}

function carregarPassagens() {
  const usuario = getUsuarioLogado();
  const chavePassagens = `passagens_${usuario.email}`;
  const passagens = JSON.parse(localStorage.getItem(chavePassagens)) || [];

  const container = document.getElementById("passagens-container");
  container.innerHTML = "";

  if (passagens.length === 0) {
    container.innerHTML = "<p class='text-muted'>Nenhuma passagem comprada ainda.</p>";
    return;
  }

  passagens.forEach((voo, index) => {
    const card = document.createElement("div");
    card.className = "card card-voo";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${voo.origem} → ${voo.destino}</h5>
        <p class="card-text">
            <strong>Companhia:</strong> ${voo.ciaAerea}<br>
            <strong>Voo:</strong> ${voo.numeroVoo}<br>
            <strong>Data de Ida:</strong> ${voo.dataIda} às ${voo.horaPartida}<br>
            <strong>Data de Volta:</strong> ${voo.dataVolta} às ${voo.horaChegada}<br>
            <strong>Classe:</strong> ${voo.classe}<br>
            <strong>Aeroporto Origem:</strong> ${voo.aeroportoOrigem}<br>
            <strong>Aeroporto Destino:</strong> ${voo.aeroportoDestino}<br>
            <strong>Paradas:</strong> ${voo.paradas}<br>
            <strong>Preço:</strong> R$ ${voo.preco.toFixed(2)}<br>
            <strong>Passageiro:</strong> ${voo.passageiro}<br>
            <strong>Localizador (PNR):</strong> ${voo.pnr}<br>
            <strong>Data da Compra:</strong> ${new Date(voo.dataCompra).toLocaleString()}
        </p>
      </div>
    `;
    container.appendChild(card);
  });
}

function carregarReservas() {
  const usuario = getUsuarioLogado();
  const chaveReservas = `reservas_${usuario.email}`;
  const reservas = JSON.parse(localStorage.getItem(chaveReservas)) || [];

  const container = document.getElementById("reservas-container");
  container.innerHTML = "";

  if (reservas.length === 0) {
    container.innerHTML = "<p class='text-muted'>Nenhuma hospedagem reservada ainda.</p>";
    return;
  }

  reservas.forEach((hospedagem, index) => {
    const card = document.createElement("div");
    card.className = "card card-hospedagem";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${hospedagem.nome}</h5>
        <p class="card-text">
            <strong>Local:</strong> ${hospedagem.localizacao.cidade}, ${hospedagem.localizacao.estado}, ${hospedagem.localizacao.pais}<br>
            <strong>Check-in:</strong> ${hospedagem.checkin}<br>
            <strong>Check-out:</strong> ${hospedagem.checkout}<br>
            <strong>Noites:</strong> ${hospedagem.noites}<br>
            <strong>Hóspedes:</strong> ${hospedagem.quantidadeHospedes}<br>
            <strong>Comodidades:</strong> ${hospedagem.comodidades.join(', ')}<br>
            <strong>Total:</strong> R$ ${hospedagem.precoTotal.toFixed(2)}<br>
            <strong>Data da Reserva:</strong> ${new Date(hospedagem.dataReserva).toLocaleString()}
        </p>
      </div>
    `;
    container.appendChild(card);
  });
}
