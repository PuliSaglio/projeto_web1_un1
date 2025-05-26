document.addEventListener("DOMContentLoaded", carregarCarrinho);

function getUsuarioLogado() {
    return JSON.parse(sessionStorage.getItem('usuarioLogado'));
}

function carregarCarrinho() {
    const usuario = getUsuarioLogado();
    if (!usuario) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
    }

    document.getElementById("nome-usuario").textContent = usuario.nome;

    const chave = `carrinho_${usuario.email}`;
    const carrinho = JSON.parse(localStorage.getItem(chave)) || [];

    const container = document.getElementById("carrinho-container");
    container.innerHTML = "";

    if (carrinho.length === 0) {
    container.innerHTML = "<p class='text-muted'>Seu carrinho está vazio.</p>";
    return;
    }

    carrinho.forEach((voo, index) => {
    const card = document.createElement("div");
    card.className = "card card-voo";

    card.innerHTML = `
        <div class="card-body">
        <h5 class="card-title">${voo.origem} → ${voo.destino}</h5>
        <p class="card-text">
            <strong>Data:</strong> ${voo.dataIda} às ${voo.horaPartida}<br>
            <strong>Companhia:</strong> ${voo.ciaAerea} | ${voo.numeroVoo}<br>
            <strong>Preço:</strong> R$ ${voo.preco.toFixed(2)}
        </p>
        <button class="btn btn-sm btn-outline-danger" onclick="removerDoCarrinho(${index})">Remover</button>
        </div>
    `;

    container.appendChild(card);
    });
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
    localStorage.removeItem(chave);
    carregarCarrinho();
}

function logout() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = "index.html";
}