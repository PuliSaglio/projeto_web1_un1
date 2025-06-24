import * as pacotesService from '../services/pacotesService.js';
import * as voosService from '../services/voosService.js';
import * as hospedagensService from '../services/hospedagensService.js';
import * as carrinhoService from '../services/carrinhoService.js';

async function adicionarPacoteAoCarrinho(pacote, usuario) {
  let carrinho = await carrinhoService.obterCarrinho(usuario.email);
  if (!Array.isArray(carrinho)) carrinho = [];

  // Buscar detalhes completos
  const voo = await voosService.buscarVooPorId(pacote.vooId);
  const hospedagem = await hospedagensService.buscarHospedagemPorId(pacote.hospedagemId);

  // Adiciona voo ao carrinho
  if (voo) {
    carrinho.push({
      vooId: pacote.vooId,
      origem: voo.origem,
      destino: voo.destino,
      ciaAerea: voo.ciaAerea,
      dataIda: voo.dataIda,
      dataVolta: voo.dataVolta,
      horaPartida: voo.horaPartida,
      horaChegada: voo.horaChegada,
      preco: voo.preco,
      quantidadePassageiros: 1,
      dataReserva: new Date().toISOString()
    });
  }

  // Adiciona hospedagem ao carrinho
  if (hospedagem) {
    const checkinDate = new Date(hospedagem.disponibilidade.checkin);
    const checkoutDate = new Date(hospedagem.disponibilidade.checkout);
    const diffTime = checkoutDate - checkinDate;
    const noites = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    carrinho.push({
      hospedagemId: pacote.hospedagemId,
      nome: hospedagem.nome,
      localizacao: hospedagem.localizacao,
      endereco: hospedagem.endereco,
      precoPorNoite: hospedagem.precoPorNoite,
      capacidadePorQuarto: hospedagem.capacidadePorQuarto,
      quartosDisponiveis: hospedagem.quartosDisponiveis,
      avaliacao: hospedagem.avaliacao,
      quantidadeEstrelas: hospedagem.quantidadeEstrelas,
      comodidades: hospedagem.comodidades,
      fotos: hospedagem.fotos,
      descricao: hospedagem.descricao,
      checkin: hospedagem.disponibilidade.checkin,
      checkout: hospedagem.disponibilidade.checkout,
      noites: noites,
      quantidadeHospedes: hospedagem.capacidadePorQuarto,
      precoTotal: hospedagem.precoPorNoite * noites 
    });
  }

  await carrinhoService.salvarCarrinho(usuario.email, carrinho);
  localStorage.setItem(`carrinho_${usuario.email}`, JSON.stringify(carrinho));
}

document.addEventListener("DOMContentLoaded", async () => {
  const pacotes = await pacotesService.listarPacotes();
  const container = document.getElementById("pacotes-container");
  container.innerHTML = "";

  // Verifica se o usuário logado é admin
  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));
  const isAdmin = usuario && usuario.role === "admin";

  for (const pacote of pacotes) {
    // Busca detalhes do voo e hospedagem
    const voo = await voosService.buscarVooPorId(pacote.vooId);
    const hospedagem = await hospedagensService.buscarHospedagemPorId(pacote.hospedagemId);

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="card shadow-sm">
        <img src="${pacote.fotos?.[0] || 'https://via.placeholder.com/400x300?text=Pacote'}" class="card-img-top" alt="${pacote.nome}">
        <div class="card-body">
          <h5 class="card-title">${pacote.nome}</h5>
          <p class="card-text">${pacote.descricao}</p>
          <p><strong>Voo:</strong> ${voo ? `${voo.origem} → ${voo.destino}` : '-'}</p>
          <p><strong>Hotel:</strong> ${hospedagem ? hospedagem.nome : '-'}</p>
          <p><strong>Preço:</strong> R$ ${pacote.preco.toFixed(2)}</p>
          <button class="btn btn-success btn-comprar-pacote">Comprar Pacote</button>
          ${isAdmin ? `
            <button class="btn btn-warning btn-editar-pacote">Editar</button>
            <button class="btn btn-danger btn-deletar-pacote">Deletar</button>
          ` : ""}
        </div>
      </div>
    `;

    // Comprar Pacote
    col.querySelector('.btn-comprar-pacote').addEventListener('click', async () => {
      const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));
      if (!usuario) {
        alert("Faça login para comprar um pacote.");
        window.location.href = "/html/login.html";
        return;
      }
      await adicionarPacoteAoCarrinho(pacote, usuario);
      window.location.href = "/html/conta.html";
    });

    // Editar Pacote (apenas admin)
    if (isAdmin) {
      col.querySelector('.btn-editar-pacote').addEventListener('click', () => {
        sessionStorage.setItem("pacoteParaEditar", JSON.stringify({ ...pacote, id: pacote.id }));
        window.location.href = "/html/edicao/editar-pacote.html";
      });

      col.querySelector('.btn-deletar-pacote').addEventListener('click', async () => {
        if (confirm("Tem certeza que deseja deletar este pacote?")) {
          await pacotesService.deletarPacote(pacote.id);
          location.reload();
        }
      });
    }

    container.appendChild(col);
  }
});