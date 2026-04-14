// Tenta carregar o carrinho salvo no navegador, ou começa um vazio []
let carrinho = JSON.parse(localStorage.getItem('meu_carrinho')) || [];
// 1. CONFIGURAÇÃO DO BANCO DE DADOS
const supabaseUrl = "https://zmgjzamigwssmqriqdst.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZ2p6YW1pZ3dzc21xcmlxZHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzI3OTIsImV4cCI6MjA4OTg0ODc5Mn0.HQHvKeoakVdV9FtN0bU88QnMNFpSOTc1sp4KQvzqUV0";

// Inicia a conexão
const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. FUNÇÃO PARA BUSCAR E DESENHAR OS PRODUTOS
async function carregarCatalogo() {
  // Faz um SELECT * FROM produtos na nuvem
  let { data: produtos, error } = await banco.from("produtos").select("*");

  if (error) {
    console.error("Erro ao buscar dados:", error);
    return;
  }

  let vitrine = document.getElementById("vitrine");
  vitrine.innerHTML = ""; // Limpa a tela

  // Loop para desenhar cada produto na tela
  produtos.forEach((item) => {
    // Cria a máscara de moeda Brasileira
    let precoFormatado = Number(item.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    let div = document.createElement("div");
    div.className = "card-produto";
    div.innerHTML = `
      <img src="${item.imagem_url}" width="150">
      <h3>${item.nome}</h3>
      <p class="preco-destaque">${precoFormatado}</p>
      <button onclick="adicionarAoCarrinho('${item.nome}', ${item.preco})">
      Adicionar ao Carrinho
  </button>
    `;
    vitrine.appendChild(div);
  });
}

// Roda a função assim que o site abrir
carregarCatalogo();
// 1. ADICIONAR ITEM
function adicionarAoCarrinho(nome, preco) {
  const item = { nome, preco };
  carrinho.push(item); // Adiciona na lista
  atualizarCarrinho(); // Atualiza a tela
}

// 2. ATUALIZAR A TELA E O LOCALSTORAGE
function atualizarCarrinho() {
  const listaHtml = document.getElementById('lista-carrinho');
  const totalHtml = document.getElementById('valor-total');
  
  listaHtml.innerHTML = ''; // Limpa a lista visual
  let somaTotal = 0;

  carrinho.forEach((item, index) => {
      somaTotal += item.preco;
      listaHtml.innerHTML += `<li>${item.nome} - R$ ${item.preco.toFixed(2)}</li>`;
  });

  // Atualiza o valor total na tela
  totalHtml.innerText = somaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // SALVA A LISTA NO NAVEGADOR (LocalStorage)
  localStorage.setItem('meu_carrinho', JSON.stringify(carrinho));
}

// 3. LIMPAR TUDO
function esvaziarCarrinho() {
  carrinho = [];
  atualizarCarrinho();
}

// Inicializa o carrinho ao carregar a página
atualizarCarrinho();