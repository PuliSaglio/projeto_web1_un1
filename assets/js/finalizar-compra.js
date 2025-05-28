document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));
  if (!usuario) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("nome").value = usuario.nome;
  document.getElementById("email").value = usuario.email;

  const chaveCarrinho = `carrinho_${usuario.email}`;
  const carrinho = JSON.parse(localStorage.getItem(chaveCarrinho)) || [];

  const resumoContainer = document.getElementById("resumo-voos");
  const totalSpan = document.getElementById("total-preco");

  let totalGeral = 0;

  const voos = carrinho.filter(i => i.origem && i.destino);
  const hospedagens = carrinho.filter(i => i.localizacao && i.checkin && i.checkout);

  if (voos.length > 0) {
    const tituloVoos = document.createElement("h5");
    tituloVoos.textContent = "Voos Selecionados:";
    resumoContainer.appendChild(tituloVoos);

    voos.forEach(voo => {
      const qtd = voo.quantidadePassageiros || 1;
      const totalVoo = voo.preco * qtd;
      totalGeral += totalVoo;

      const card = document.createElement("div");
      card.className = "card card-voo mb-3";

      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${voo.origem} → ${voo.destino}</h5>
          <p class="card-text">
            <strong>Companhia:</strong> ${voo.ciaAerea}<br>
            <strong>Data de ida:</strong> ${voo.dataIda} às ${voo.horaPartida}<br>
            <strong>Passageiros:</strong> ${qtd}<br>
            <strong>Preço unitário:</strong> R$ ${voo.preco.toFixed(2)}<br>
            <strong>Subtotal:</strong> <span class="text-success fw-bold">R$ ${totalVoo.toFixed(2)}</span>
          </p>
        </div>
      `;

      resumoContainer.appendChild(card);
    });
  }

  if (hospedagens.length > 0) {
    const tituloHosp = document.createElement("h5");
    tituloHosp.textContent = "Hospedagens Selecionadas:";
    tituloHosp.classList.add("mt-4");
    resumoContainer.appendChild(tituloHosp);

    hospedagens.forEach(h => {
      const totalHosp = h.precoTotal || (h.noites * h.precoPorNoite);
      totalGeral += totalHosp;

      const card = document.createElement("div");
      card.className = "card card-hospedagem mb-3";

      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${h.nome}</h5>
          <p class="card-text">
            <strong>Local:</strong> ${h.localizacao.cidade}, ${h.localizacao.estado}<br>
            <strong>Check-in:</strong> ${h.checkin}<br>
            <strong>Check-out:</strong> ${h.checkout}<br>
            <strong>Hóspedes:</strong> ${h.quantidadeHospedes}<br>
            <strong>Noites:</strong> ${h.noites}<br>
            <strong>Total:</strong> <span class="text-success fw-bold">R$ ${totalHosp.toFixed(2)}</span>
          </p>
        </div>
      `;

      resumoContainer.appendChild(card);
    });
  }

  totalSpan.textContent = totalGeral.toFixed(2);
});

document.getElementById("form-compra").addEventListener("submit", function(event) {
  event.preventDefault();

  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));
  const chaveCarrinho = `carrinho_${usuario.email}`;
  const chavePassagens = `passagens_${usuario.email}`;
  const chaveReservas = `reservas_${usuario.email}`;

  const carrinho = JSON.parse(localStorage.getItem(chaveCarrinho)) || [];
  const passagensAntigas = JSON.parse(localStorage.getItem(chavePassagens)) || [];
  const reservasAntigas = JSON.parse(localStorage.getItem(chaveReservas)) || [];

  const novasPassagens = [];
  const novasReservas = [];

  carrinho.forEach(item => {
    // VOOS
    if (item.origem && item.destino) {
      const qtd = item.quantidadePassageiros || 1;
      for (let i = 0; i < qtd; i++) {
        const pnr = gerarPNR();
        novasPassagens.push({
          ...item,
          passageiro: i + 1,
          pnr,
          dataCompra: new Date().toISOString()
        });
      }
    }

    // HOSPEDAGENS
    if (item.localizacao && item.checkin && item.checkout) {
      novasReservas.push({
        ...item,
        dataReserva: new Date().toISOString()
      });
    }
  });

  // Salvar separadamente
  localStorage.setItem(chavePassagens, JSON.stringify([...passagensAntigas, ...novasPassagens]));
  localStorage.setItem(chaveReservas, JSON.stringify([...reservasAntigas, ...novasReservas]));
  localStorage.removeItem(chaveCarrinho);

  alert("Compra finalizada com sucesso! Suas passagens e reservas foram salvas.");
  window.location.href = "conta.html";
});

function gerarPNR() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}