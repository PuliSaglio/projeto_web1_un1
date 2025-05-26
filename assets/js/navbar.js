document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");
  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));

  if (usuario) {
    // Navbar para usuário logado
    navbarContainer.innerHTML = `
      <div class="navbar">
        <div class="left">
          <a href="flights.html" class="active">✈️ <span>Voos</span></a>
          <a href="stays.html">🛏️ <span>Hospedagens</span></a>
        </div>
        <div class="logo">
          <a href="index.html">IMD Viagens</a>
        </div>
        <div class="right" id="user-area">
          <span id="user-nome" class="me-2">Olá, ${usuario.nome.split(" ")[0]}</span>
          <a href="conta.html" class="btn btn-outline-secondary btn-sm">Minha Conta</a>
          <button class="btn btn-danger btn-sm ms-2" onclick="logout()">Sair</button>
        </div>
      </div>
    `;
  } else {
    // Navbar padrão
    navbarContainer.innerHTML = `
      <div class="navbar">
        <div class="left">
          <a href="flights.html" class="active">✈️ <span>Voos</span></a>
          <a href="stays.html">🛏️ <span>Hospedagens</span></a>
        </div>
        <div class="logo">
          <a href="index.html">IMD Viagens</a>
        </div>
        <div class="right">
          <a href="login.html">Login</a>
          <a href="cadastro.html" class="signup">Cadastro</a>
        </div>
      </div>
    `;
  }
});

function logout() {
  sessionStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}
