// 1. CONFIGURAÇÃO DO BANCO DE DADOS
const supabaseUrl = "https://zmgjzamigwssmqriqdst.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZ2p6YW1pZ3dzc21xcmlxZHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzI3OTIsImV4cCI6MjA4OTg0ODc5Mn0.HQHvKeoakVdV9FtN0bU88QnMNFpSOTc1sp4KQvzqUV0";

const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. VARIÁVEL DO CARRINHO (Memória local)
let carrinho = [];

// 3. FUNÇÃO PARA ATUALIZAR A TELA DO CARRINHO
function atualizarCarrinho() {
  const listaHtml = document.getElementById("lista-carrinho");
  const totalHtml = document.getElementById("total-carrinho");

  listaHtml.innerHTML = ""; // Limpa a lista antes de redesenhar
  let somaTotal = 0;

  carrinho.forEach((item, index) => {
    somaTotal += Number(item.preco);

    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "8px 0";
    li.style.borderBottom = "1px solid #e5e7eb";

    li.innerHTML = `
            <span>${item.nome} - <strong>R$ ${Number(item.preco).toFixed(
      2
    )}</strong></span>
            <button onclick="removerDoCarrinho(${index})" style="background: #fee2e2; color: #ef4444; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">❌</button>
        `;
    listaHtml.appendChild(li);
  });

  totalHtml.innerText = somaTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// 4. FUNÇÕES DE INTERAÇÃO (Disponibilizadas globalmente para o HTML)
window.adicionarAoCarrinho = (nome, preco) => {
  carrinho.push({ nome, preco });
  atualizarCarrinho();
};

window.removerDoCarrinho = (index) => {
  carrinho.splice(index, 1); // Remove apenas o item clicado usando o índice
  atualizarCarrinho();
};

// 5. CARREGAR PRODUTOS DA VITRINE
async function carregarCatalogo() {
  let { data: produtos, error } = await banco.from("produtos").select("*");

  if (error) {
    console.error("Erro ao buscar dados:", error);
    return;
  }

  const vitrine = document.getElementById("vitrine");
  vitrine.innerHTML = "";

  produtos.forEach((item) => {
    const precoFormatado = Number(item.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const div = document.createElement("div");
    div.className = "card-produto";
    div.innerHTML = `
            <img src="${item.imagem_url}" width="150" style="border-radius: 8px;">
            <h3>${item.nome}</h3>
            <p class="preco-destaque">${precoFormatado}</p>
            <button class="btn-adicionar" onclick="adicionarAoCarrinho('${item.nome}', ${item.preco})">
                🛒 Adicionar ao Carrinho
            </button>
        `;
    vitrine.appendChild(div);
  });
}

// Inicia o catálogo ao abrir a página
carregarCatalogo();
