import * as carrinhoService from '../services/carrinhoService.js';
import * as voosService from '../services/voosService.js';
import * as hospedagensService from '../services/hospedagensService.js';
import { db } from '../services/firebaseConfig.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

function getUsuarioLogado() {
  const usuario = sessionStorage.getItem("usuarioLogado");
  return usuario ? JSON.parse(usuario) : null;
}

function gerarPNR() {
  return Array.from({length: 6}, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
}

async function salvarCompras(usuario, carrinho) {
  for (const item of carrinho) {
    if (item.vooId) {
      for (let i = 0; i < (item.quantidadePassageiros || 1); i++) {
        const pnr = gerarPNR();
        await push(ref(db, `usuarios/${btoa(usuario.email)}/passagens`), {
          vooId: item.vooId,
          pnr,
          dataCompra: new Date().toISOString()
        });
      }
    }
    if (item.hospedagemId) {
      await push(ref(db, `usuarios/${btoa(usuario.email)}/reservas`), {
        hospedagemId: item.hospedagemId,
        nome: item.nome,
        checkin: item.checkin,
        checkout: item.checkout,
        quantidadeHospedes: item.quantidadeHospedes,
        precoTotal: item.precoTotal,
        dataCompra: new Date().toISOString()
      });
    }
  }
}

async function carregarProdutosCarrinho() {
  const usuario = getUsuarioLogado();
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }
  const carrinho = await carrinhoService.obterCarrinho(usuario.email);
  const container = document.getElementById("produtos-carrinho");
  if (!carrinho || carrinho.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    document.getElementById("form-pagamento").style.display = "none";
    return;
  }

  let total = 0;
  let html = `
    <table class="table align-middle">
      <thead>
        <tr>
          <th>Produto</th>
          <th>Detalhes</th>
          <th class="text-end">Subtotal</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const item of carrinho) {
    if (item.vooId) {
      const voo = await voosService.buscarVooPorId(item.vooId);
      if (voo) {
        const subtotal = voo.preco * (item.quantidadePassageiros || 1);
        total += subtotal;
        html += `
          <tr>
            <td>Voo<br><small class="text-muted">${voo.ciaAerea}</small></td>
            <td>
              ${voo.origem} → ${voo.destino}<br>
              Passageiros: ${item.quantidadePassageiros}<br>
              Data Ida: ${voo.dataIda} ${voo.horaPartida}<br>
              Data Volta: ${voo.dataVolta} ${voo.horaChegada}
            </td>
            <td class="text-end">R$ ${subtotal.toFixed(2)}</td>
          </tr>
        `;
      }
    } else if (item.hospedagemId) {
      const hospedagem = await hospedagensService.buscarHospedagemPorId(item.hospedagemId);
      const subtotal = item.precoTotal || 0;
      total += subtotal;
      html += `
        <tr>
          <td>Hospedagem<br><small class="text-muted">${item.nome}</small></td>
          <td>
            ${item.localizacao.cidade}, ${item.localizacao.estado}, ${item.localizacao.pais}<br>
            Check-in: ${item.checkin}<br>
            Check-out: ${item.checkout}<br>
            Hóspedes: ${item.quantidadeHospedes}
          </td>
          <td class="text-end">R$ ${subtotal.toFixed(2)}</td>
        </tr>
      `;
    }
  }

  html += `
      </tbody>
      <tfoot>
        <tr>
          <th colspan="2" class="text-end">Total:</th>
          <th class="text-end text-success">R$ ${total.toFixed(2)}</th>
        </tr>
      </tfoot>
    </table>
  `;

  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", carregarProdutosCarrinho);

// Lógica para exibir campos conforme a forma de pagamento
const selectForma = document.getElementById("forma-pagamento");
const divCartao = document.getElementById("pagamento-cartao");
const divPix = document.getElementById("pagamento-pix");
const divBoleto = document.getElementById("pagamento-boleto");

selectForma.addEventListener("change", function() {
  divCartao.style.display = this.value === "cartao" ? "block" : "none";
  divPix.style.display = this.value === "pix" ? "block" : "none";
  divBoleto.style.display = this.value === "boleto" ? "block" : "none";
});

document.getElementById("form-pagamento").addEventListener("submit", async function(e) {
  e.preventDefault();
  const forma = selectForma.value;
  const btn = this.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.textContent = "Processando...";

  try {
    if (!forma) throw new Error("Escolha uma forma de pagamento.");

    if (forma === "cartao") {
      if (
        !document.getElementById("numero-cartao").value ||
        !document.getElementById("nome-cartao").value ||
        !document.getElementById("validade-cartao").value ||
        !document.getElementById("cvv-cartao").value
      ) {
        throw new Error("Preencha todos os campos do cartão.");
      }
      const resposta = await fetch("https://reqres.in/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: document.getElementById("numero-cartao").value,
          nome: document.getElementById("nome-cartao").value,
          validade: document.getElementById("validade-cartao").value,
          cvv: document.getElementById("cvv-cartao").value
        })
      });
      if (!resposta.ok) throw new Error("Pagamento recusado pelo cartão.");
      document.getElementById("mensagem-pagamento").innerHTML = `<div class="alert alert-success">Pagamento aprovado! Obrigado pela compra.</div>`;
    } else if (forma === "pix") {
      document.getElementById("mensagem-pagamento").innerHTML = `<div class="alert alert-success">Pagamento via Pix recebido! Obrigado pela compra.</div>`;
    } else if (forma === "boleto") {
      document.getElementById("mensagem-pagamento").innerHTML = `<div class="alert alert-success">Boleto gerado! Pagamento confirmado após compensação bancária.</div>`;
    }

    const usuario = getUsuarioLogado();
    const carrinho = await carrinhoService.obterCarrinho(usuario.email);
    await salvarCompras(usuario, carrinho);

    await carrinhoService.salvarCarrinho(usuario.email, []);
    document.getElementById("mensagem-pagamento").innerHTML = `<div class="alert alert-success">Compra finalizada com sucesso!</div>`;
    setTimeout(() => window.location.href = "conta.html", 2000);

  } catch (err) {
    document.getElementById("mensagem-pagamento").innerHTML = `<div class="alert alert-danger">Erro ao finalizar compra: ${err.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Pagar";
  }
});