document.querySelector('.formulario').addEventListener('submit', function(event) {
    event.preventDefault();
    const dadosLogin = coletarDadosFormLogin();
    if(validarFormLogin(dadosLogin) == 1){
        return;
    }
    else{
        login(dadosLogin.email, dadosLogin.senha);
    }
});

function coletarDadosFormLogin(){
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    return{
        email,
        senha
    }
}

function validarFormLogin(dadosLogin){
    if(!dadosLogin.email || !dadosLogin.senha){
        alert("Por favor preencha todos os campos");
        return 1;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dadosLogin.email)) {
    alert('Digite um e-mail válido.');
    return 1;
    }
}

function login(email, senha) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    alert("Login realizado!");
    window.location.href = "conta.html";
  } else {
    alert("Email ou senha inválidos.");
  }
}
