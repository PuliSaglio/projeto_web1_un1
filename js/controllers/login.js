import * as usuariosService from '../services/usuariosService.js';

document.querySelector('.formulario').addEventListener('submit', async function(event) {
    event.preventDefault();
    const dadosLogin = coletarDadosFormLogin();
    if(validarFormLogin(dadosLogin) == 1){
        return;
    } else {
        await login(dadosLogin.email, dadosLogin.senha);
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

async function login(email, senha) {
    const usuario = await usuariosService.buscarUsuarioPorEmailESenha(email, senha);
    if (usuario) {
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        window.location.href = "conta.html";
    } else {
        alert("Email ou senha inválidos.");
    }
}
