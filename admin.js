// 1. CONFIGURAÇÃO DO BANCO
const supabaseUrl = "https://zmgjzamigwssmqriqdst.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZ2p6YW1pZ3dzc21xcmlxZHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzI3OTIsImV4cCI6MjA4OTg0ODc5Mn0.HQHvKeoakVdV9FtN0bU88QnMNFpSOTc1sp4KQvzqUV0";
const banco = window.supabase.createClient(supabaseUrl, supabaseKey);
async function verificarAcesso() {
  // Pergunta ao Supabase: Tem alguém logado?
  const {
    data: { user },
  } = await banco.auth.getUser();

  if (!user) {
    alert("Área restrita! Faça login primeiro.");
    window.location.href = "login.html"; // Expulsa o invasor
  } else {
    // Se estiver logado, mostra quem é
    document.getElementById("nome-usuario").innerText = user.email;
  }
}
verificarAcesso();
// 2. FUNÇÃO DE CADASTRO
async function cadastrarProduto() {
  // Captura os valores digitados no HTML
  let nomeProduto = document.getElementById("input-nome").value;
  let precoProduto = document.getElementById("input-preco").value;
  let imagemProduto = document.getElementById("input-imagem").value;
  let aviso = document.getElementById("mensagem-aviso");

  // Validação de segurança básica
  if (nomeProduto === "" || precoProduto === "") {
    aviso.innerText = "Preencha todos os campos!";
    aviso.style.color = "red";
    return;
  }

  aviso.innerText = "Salvando na nuvem...";
  aviso.style.color = "blue";

  // Envia o comando INSERT para a tabela 'produtos' no Supabase
  let { error } = await banco.from("produtos").insert([
    {
      nome: nomeProduto,
      preco: parseFloat(precoProduto), // Garantindo que o preço seja um número
      imagem_url: imagemProduto,
    },
  ]);

  if (error) {
    aviso.innerText = "Erro ao salvar: " + error.message;
    aviso.style.color = "red";
  } else {
    aviso.innerText = "Produto cadastrado com sucesso!";
    aviso.style.color = "green";

    // Limpa as caixas de texto
    document.getElementById("input-nome").value = "";
    document.getElementById("input-preco").value = "";
    document.getElementById("input-imagem").value = "";

    // Opcional: recarregar a vitrine para mostrar o novo produto
    desenharVitrine();
  }
}

// 3. FUNÇÃO PARA BUSCAR E DESENHAR A VITRINE (COM MÁSCARA DE DINHEIRO)
async function desenharVitrine() {
  let vitrine = document.getElementById("vitrine"); // Certifique-se que existe essa ID no seu HTML

  // Busca os dados do Supabase
  let { data: produtos, error } = await banco.from("produtos").select("*");

  if (error) {
    console.error("Erro ao buscar produtos:", error.message);
    return;
  }

  // Limpa a vitrine antes de desenhar (para não duplicar)
  vitrine.innerHTML = "";

  // Percorre cada item vindo do banco
  produtos.forEach((item) => {
    // APLICAÇÃO DA MÁSCARA (O Toque Profissional)
    let precoFormatado = Number(item.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    let div = document.createElement("div");
    div.className = "card-produto";
    div.innerHTML = `
        <img src="${item.imagem_url}" width="150" alt="${item.nome}">
        <h3>${item.nome}</h3>
        <p class="preco-destaque">${precoFormatado}</p>
    `;
    vitrine.appendChild(div);
  });
}

// Chama a função para desenhar a vitrine assim que a página carregar
desenharVitrine();
async function sairDoSistema() {
  await banco.auth.signOut();
  window.location.href = "index.html"; // Manda de volta para a vitrine pública
}
