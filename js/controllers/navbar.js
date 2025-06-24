document.addEventListener("DOMContentLoaded", () => {
  const authButtons = document.getElementById("auth-buttons");
  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));

  if (usuario) {
    authButtons.innerHTML = `
      <a href="/html/conta.html" class="btn btn-outline-light me-2">Minha Conta</a>
      <button class="btn btn-danger font-bold" onclick="logout()"><i class="bi bi-box-arrow-right"></i></button>
    `;
  } else {
    authButtons.innerHTML = `
      <a href="/html/cadastro.html" class="btn btn-outline-light me-2">Cadastro</a>
      <a href="/html/login.html" class="btn btn-outline-light">Login</a>
    `;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-container");
  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));

  if (usuario) {
    navbarContainer.innerHTML = `
      <div class="navbar">
        <div class="left">
          <a href="/html/flights.html" class="active">✈️ <span>Voos</span></a>
          <a href="/html/stays.html">🛏️ <span>Hospedagens</span></a>
        </div>
        <div class="logo">
          <a href="/html/index.html">IMD Viagens</a>
        </div>
        <div class="right" id="user-area">
          <span id="user-nome" class="me-2">Olá, ${usuario.nome.split(" ")[0]}</span>
          <a href="/html/conta.html" class="btn btn-outline-secondary btn-sm">Minha Conta</a>
          <button class="btn btn-danger btn-sm ms-2" onclick="logout()">Sair</button>
        </div>
      </div>
    `;
  } else {
    navbarContainer.innerHTML = `
      <div class="navbar">
        <div class="left">
          <a href="/html/flights.html" class="active">✈️ <span>Voos</span></a>
          <a href="/html/stays.html">🛏️ <span>Hospedagens</span></a>
        </div>
        <div class="logo">
          <a href="/html/index.html">IMD Viagens</a>
        </div>
        <div class="right">
          <a href="/html/login.html">Login</a>
          <a href="/html/cadastro.html" class="signup">Cadastro</a>
        </div>
      </div>
    `;
  }
});

function logout() {
  sessionStorage.removeItem("usuarioLogado");
  window.location.href = "/html/index.html";
}