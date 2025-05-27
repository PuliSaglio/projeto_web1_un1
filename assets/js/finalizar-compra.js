document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
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

  let total = 0;

  carrinho.forEach(voo => {
    const qtd = voo.quantidadePassageiros || 1;
    const totalVoo = voo.preco * qtd;
    total += totalVoo;

    const card = document.createElement("div");
    card.className = "card card-voo";

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

  totalSpan.textContent = total.toFixed(2);
});


    // Confirmação da compra
    document.getElementById("form-compra").addEventListener("submit", function(event) {
  event.preventDefault();

  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));
  const chaveCarrinho = `carrinho_${usuario.email}`;
  const chavePassagens = `passagens_${usuario.email}`;

  const carrinho = JSON.parse(localStorage.getItem(chaveCarrinho)) || [];
  const passagensAnteriores = JSON.parse(localStorage.getItem(chavePassagens)) || [];

  const novasPassagens = [];

  carrinho.forEach(voo => {
    const qtd = voo.quantidadePassageiros || 1;

    for (let i = 0; i < qtd; i++) {
      const pnr = gerarPNR();
      const novaPassagem = {
        ...voo,
        pnr,
        dataCompra: new Date().toISOString(),
        passageiro: i + 1
      };
      novasPassagens.push(novaPassagem);
    }
  });

  // Salvar tudo no localStorage
  const todasPassagens = [...passagensAnteriores, ...novasPassagens];
  localStorage.setItem(chavePassagens, JSON.stringify(todasPassagens));
  localStorage.removeItem(chaveCarrinho);

  alert("Compra finalizada com sucesso! Suas passagens foram geradas.");
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
=======
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
  
    let total = 0;
  
    carrinho.forEach(voo => {
      const qtd = voo.quantidadePassageiros || 1;
      const totalVoo = voo.preco * qtd;
      total += totalVoo;
  
      const card = document.createElement("div");
      card.className = "card card-voo";
  
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
  
    totalSpan.textContent = total.toFixed(2);
  });
  
  
      // Confirmação da compra
      document.getElementById("form-compra").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));
    const chaveCarrinho = `carrinho_${usuario.email}`;
    const chavePassagens = `passagens_${usuario.email}`;
  
    const carrinho = JSON.parse(localStorage.getItem(chaveCarrinho)) || [];
    const passagensAnteriores = JSON.parse(localStorage.getItem(chavePassagens)) || [];
  
    const novasPassagens = [];
  
    carrinho.forEach(voo => {
      const qtd = voo.quantidadePassageiros || 1;
  
      for (let i = 0; i < qtd; i++) {
        const pnr = gerarPNR();
        const novaPassagem = {
          ...voo,
          pnr,
          dataCompra: new Date().toISOString(),
          passageiro: i + 1
        };
        novasPassagens.push(novaPassagem);
      }
    });
  
    // Salvar tudo no localStorage
    const todasPassagens = [...passagensAnteriores, ...novasPassagens];
    localStorage.setItem(chavePassagens, JSON.stringify(todasPassagens));
    localStorage.removeItem(chaveCarrinho);
  
    alert("Compra finalizada com sucesso! Suas passagens foram geradas.");
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
>>>>>>> expedito
