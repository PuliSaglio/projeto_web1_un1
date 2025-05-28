const hospedagem = JSON.parse(sessionStorage.getItem("hospedagemSelecionada"));

if (!hospedagem) {
  document.getElementById("conteudo-hospedagem").innerHTML = "<p>Hospedagem não encontrada.</p>";
}

const estrelas = "⭐".repeat(hospedagem.quantidadeEstrelas);

document.getElementById("conteudo-hospedagem").innerHTML = `
  <h2>${hospedagem.nome}</h2>
  <p class="text-muted">${hospedagem.localizacao.cidade}, ${hospedagem.localizacao.estado} – ${hospedagem.localizacao.pais}
  </p>
  <div class="row g-4 my-3 fotos-hotel">
      ${hospedagem.fotos.map(foto => `<div class="col-md-6"><img src="${foto}" alt="Foto do hotel" /></div>`).join("")}
  </div>

  <p><strong>Endereço:</strong> ${hospedagem.endereco}</p>
  <p><strong>Estrelas:</strong> ${estrelas}</p>
  <p><strong>Avaliação:</strong> ${hospedagem.avaliacao} / 5</p>
  <p><strong>Preço por noite:</strong> R$ ${hospedagem.precoPorNoite.toFixed(2)}</p>
  <p><strong>Capacidade por quarto:</strong> ${hospedagem.capacidadePorQuarto} pessoa(s)</p>
  <p><strong>Quartos disponíveis:</strong> ${hospedagem.quartosDisponiveis}</p>
  <p><strong>Disponível de:</strong> ${hospedagem.disponibilidade.checkin} até ${hospedagem.disponibilidade.checkout}</p>
  <p><strong>Comodidades:</strong> ${hospedagem.comodidades.join(", ")}</p>
  <p>${hospedagem.descricao}</p>

  <div class="mt-4">
    <button id="btn-reservar" class="btn btn-success btn-lg">Reservar Agora</button>
  </div>
`;

document.getElementById("btn-reservar").addEventListener("click", () => {
  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));
  if (!usuario) {
    alert("Você precisa estar logado para reservar.");
    window.location.href = "login.html";
    return;
  }

  const filtros = JSON.parse(localStorage.getItem("filtrosHospedagem")) || {};
  const checkin = filtros.dataCheckin;
  const checkout = filtros.dataCheckout;
  const numHospedes = filtros.numHospedes || 1;

  if (!checkin || !checkout) {
    alert("Informações de data inválidas. Por favor, refaça a busca.");
    return;
  }

  const dataCheckin = new Date(checkin);
  const dataCheckout = new Date(checkout);
  const noites = Math.ceil((dataCheckout - dataCheckin) / (1000 * 60 * 60 * 24));

  if (noites <= 0) { alert("Datas de reserva inválidas."); return; } const total = hospedagem.precoPorNoite * noites; const
    reserva = {
      ...hospedagem, checkin, checkout, noites, quantidadeHospedes: numHospedes, precoTotal: total, dataReserva:
        new Date().toISOString()
    }; const chaveCarrinho = `carrinho_${usuario.email}`; const
      carrinho = JSON.parse(localStorage.getItem(chaveCarrinho)) || []; carrinho.push(reserva);
  localStorage.setItem(chaveCarrinho, JSON.stringify(carrinho));
  window.location.href = "conta.html";
});
