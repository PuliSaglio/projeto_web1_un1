import { db } from '../services/firebaseConfig.js';
import { ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import * as carrinhoService from '../services/carrinhoService.js';
import * as voosService from '../services/voosService.js';
import * as hospedagensService from '../services/hospedagensService.js';

document.addEventListener("DOMContentLoaded", function(){
    carregarCarrinho();
    carregarPassagens();
    carregarReservas();
    mostrarBotaoAdmin();
});

async function carregarCarrinho() {
  const usuario = getUsuarioLogado();
  if (!usuario) return;
  let carrinho = await carrinhoService.obterCarrinho(usuario.email);
  if (!Array.isArray(carrinho)) carrinho = [];
  localStorage.setItem(`carrinho_${usuario.email}`, JSON.stringify(carrinho)); // opcional

  const container = document.getElementById("carrinho-container");
  container.innerHTML = "";

  if (carrinho.length === 0) {
    container.innerHTML = "<p class='text-muted'>Seu carrinho está vazio.</p>";
    return;
  }

  for (const item of carrinho) {
    if (item.vooId) {
      const voo = await voosService.buscarVooPorId(item.vooId);
      if (voo) {
        const precoTotal = voo.preco * (item.quantidadePassageiros || 1);
        const card = document.createElement("div");
        card.className = "card card-voo mb-3";
        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${voo.origem} → ${voo.destino}</h5>
            <p class="card-text">
              <strong>Companhia:</strong> ${voo.ciaAerea}<br>
              <strong>Passageiros:</strong> ${item.quantidadePassageiros}<br>
              <strong>Preço por pessoa:</strong> R$ ${voo.preco.toFixed(2)}<br>
              <strong>Total:</strong> <span class="text-success">R$ ${precoTotal.toFixed(2)}</span>
            </p>
            <button class="btn btn-sm btn-outline-danger" onclick="removerVooDoCarrinho('${item.vooId}')">Remover</button>
          </div>
        `;
        container.appendChild(card);
      }
    }
    else if (item.hospedagemId) {
      const card = document.createElement("div");
      card.className = "card card-hospedagem mb-3";
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${item.nome}</h5>
          <p class="card-text">
            <strong>Local:</strong> ${item.localizacao.cidade}, ${item.localizacao.estado}, ${item.localizacao.pais}<br>
            <strong>Endereço:</strong> ${item.endereco}<br>
            <strong>Check-in:</strong> ${item.checkin}<br>
            <strong>Check-out:</strong> ${item.checkout}<br>
            <strong>Noites:</strong> ${item.noites}<br>
            <strong>Hóspedes:</strong> ${item.quantidadeHospedes}<br>
            <strong>Comodidades:</strong> ${item.comodidades.join(', ')}<br>
            <strong>Total:</strong> <span class="text-success">R$ ${item.precoTotal.toFixed(2)}</span>
          </p>
          <button class="btn btn-sm btn-outline-danger" onclick="removerHospedagemDoCarrinho('${item.hospedagemId}')">Remover</button>
        </div>
      `;
      container.appendChild(card);
    }
  }
}

window.removerVooDoCarrinho = async function(vooId) {
  const usuario = getUsuarioLogado();
  let carrinho = await carrinhoService.obterCarrinho(usuario.email);
  carrinho = carrinho.filter(item => item.vooId !== vooId);
  await carrinhoService.salvarCarrinho(usuario.email, carrinho);
  localStorage.setItem(`carrinho_${usuario.email}`, JSON.stringify(carrinho));
  carregarCarrinho();
}

window.removerHospedagemDoCarrinho = async function(hospedagemId) {
  const usuario = getUsuarioLogado();
  let carrinho = await carrinhoService.obterCarrinho(usuario.email);
  carrinho = carrinho.filter(item => item.hospedagemId !== hospedagemId);
  await carrinhoService.salvarCarrinho(usuario.email, carrinho);
  localStorage.setItem(`carrinho_${usuario.email}`, JSON.stringify(carrinho));
  carregarCarrinho();
}

export async function adicionarVooAoCarrinho(reserva, usuario) {
  let carrinho = await carrinhoService.obterCarrinho(usuario.email);
  if (!Array.isArray(carrinho)) carrinho = [];
  carrinho.push(reserva);
  await carrinhoService.salvarCarrinho(usuario.email, carrinho);
  localStorage.setItem(`carrinho_${usuario.email}`, JSON.stringify(carrinho));
}


async function carregarPassagens() {
  const usuario = getUsuarioLogado();
  if (!usuario) return;
  const snapshot = await get(child(ref(db), `usuarios/${btoa(usuario.email)}/passagens`));
  const container = document.getElementById("passagens-container");
  container.innerHTML = "";
  if (!snapshot.exists()) {
    container.innerHTML = "<p>Nenhuma passagem encontrada.</p>";
    return;
  }
  const passagens = Object.values(snapshot.val());
  for (const passagem of passagens) {
    const voo = await voosService.buscarVooPorId(passagem.vooId);
    if (voo) {
      container.innerHTML += `
        <div class="card mb-2">
          <div class="card-body">
            <strong>PNR:</strong> ${passagem.pnr}<br>
            <strong>Voo:</strong> ${voo.numeroVoo || '-'}<br>
            <strong>Origem:</strong> ${voo.origem} (${voo.aeroportoOrigem})<br>
            <strong>Destino:</strong> ${voo.destino} (${voo.aeroportoDestino})<br>
            <strong>Companhia:</strong> ${voo.ciaAerea}<br>
            <strong>Classe:</strong> ${voo.classe || '-'}<br>
            <strong>Data Ida:</strong> ${voo.dataIda} ${voo.horaPartida}<br>
            <strong>Data Volta:</strong> ${voo.dataVolta} ${voo.horaChegada}<br>
            <strong>Duração:</strong> ${voo.duracao}<br>
            <strong>Paradas:</strong> ${voo.paradas}<br>
            <strong>Data da compra:</strong> ${new Date(passagem.dataCompra).toLocaleString()}
          </div>
        </div>
      `;
    } else {
      container.innerHTML += `
        <div class="card mb-2">
          <div class="card-body">
            <strong>PNR:</strong> ${passagem.pnr}<br>
            <strong>Voo:</strong> ${passagem.vooId}<br>
            <span class="text-danger">Dados do voo não encontrados.</span>
          </div>
        </div>
      `;
    }
  }
}

async function carregarReservas() {
  const usuario = getUsuarioLogado();
  if (!usuario) return;
  const snapshot = await get(child(ref(db), `usuarios/${btoa(usuario.email)}/reservas`));
  const container = document.getElementById("reservas-container");
  container.innerHTML = "";
  if (!snapshot.exists()) {
    container.innerHTML = "<p>Nenhuma reserva encontrada.</p>";
    return;
  }
  const reservas = Object.values(snapshot.val());
  for (const reserva of reservas) {
    container.innerHTML += `
      <div class="card mb-2">
        <div class="card-body">
          <strong>Hospedagem:</strong> ${reserva.nome}<br>
          <strong>Check-in:</strong> ${reserva.checkin}<br>
          <strong>Check-out:</strong> ${reserva.checkout}<br>
          <strong>Hóspedes:</strong> ${reserva.quantidadeHospedes}<br>
          <strong>Valor total:</strong> R$ ${reserva.precoTotal ? reserva.precoTotal.toFixed(2) : '-'}<br>
          <strong>Data da compra:</strong> ${new Date(reserva.dataCompra).toLocaleString()}
        </div>
      </div>
    `;
  }
}

function getUsuarioLogado() {
  const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
  if (usuario === null) {
    window.location.href = "index.html";
    return null;
  }
  
  return usuario;
}

function logout() {
  sessionStorage.removeItem('usuarioLogado');
  window.location.href = "index.html";
}

function mostrarBotaoAdmin() {
    const usuario = getUsuarioLogado();
    if (usuario && usuario.role === "admin") {
        const container = document.querySelector(".container.py-5");
        if (container) {
            const div = document.createElement("div");
            div.className = "mb-4 text-end";
            div.innerHTML = `
                <a href="cadastro-voo.html" class="btn btn-warning fw-bold me-2">
                    Cadastrar Novo Voo (Admin)
                </a>
                <a href="cadastro-hospedagem.html" class="btn btn-warning fw-bold">
                    Cadastrar Novo Hotel (Admin)
                </a>
            `;
            container.insertBefore(div, container.firstChild.nextSibling);
        }
    }
}