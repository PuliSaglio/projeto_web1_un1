import * as usuariosService from '../services/usuariosService.js';

document.querySelector('.formulario').addEventListener('submit', async function(event) {
  event.preventDefault();

  const dadosCadastro = coletarDadosFormCadastro();
  if (validarFormCadastro(dadosCadastro) == 1) {
    return;
  } else {
    const existe = await usuariosService.usuarioExiste(dadosCadastro.email);
    if (existe) {
      alert("Usuário já existe.");
      return;
    }
    await usuariosService.adicionarUsuario({
      nome: dadosCadastro.nome,
      email: dadosCadastro.email,
      telefone: dadosCadastro.telefone,
      senha: dadosCadastro.senha,
      role: "user"
    });
    alert("Usuário registrado com sucesso!");
    window.location.href = '/html/login.html';
  }
});

function validarFormCadastro(dadosCadastro) {
  if (!dadosCadastro.nome || !dadosCadastro.email || !dadosCadastro.telefone || !dadosCadastro.senha) {
    alert('Por favor, preencha todos os campos.');
    return 1;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(dadosCadastro.email)) {
    alert('Digite um e-mail válido.');
    return 1;
  }

  if (dadosCadastro.senha.length < 6) {
    alert('A senha deve ter no mínimo 6 caracteres.');
    return 1;
  }

  if (!dadosCadastro.termos) {
    alert('Você precisa aceitar os termos.');
    return 1;
  }
}

function coletarDadosFormCadastro() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const termos = document.getElementById('termos').checked;

  return {
    nome,
    email,
    telefone,
    senha,
    termos
  }
}

