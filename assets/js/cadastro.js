document.querySelector('.formulario').addEventListener('submit', function(event) {
  event.preventDefault();

  dadosCadastro = coletarDadosFormCadastro();
  if(validarFormCadastro(dadosCadastro) == 1){
    return;
  }else{
    registrarUsuario(dadosCadastro.email, dadosCadastro.senha, dadosCadastro.nome);
    window.location.href = 'login.html';
  }

});

function validarFormCadastro(dadosCadastro){
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

function coletarDadosFormCadastro(){
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const termos = document.querySelector('#termos input[type="checkbox"]').checked;

    return{
        nome,
        email,
        telefone,
        senha,
        termos
    }
}

function registrarUsuario(email, senha, nome) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.find(u => u.email === email)) {
    alert("Usuário já existe.");
    return;
  }

  usuarios.push({ email, senha, nome });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Usuário registrado com sucesso!");
}

