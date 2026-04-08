const supabaseUrl = "https://zmgjzamigwssmqriqdst.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZ2p6YW1pZ3dzc21xcmlxZHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzI3OTIsImV4cCI6MjA4OTg0ODc5Mn0.HQHvKeoakVdV9FtN0bU88QnMNFpSOTc1sp4KQvzqUV0";
const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- 🐞 Desafio 2: Bloqueio Reverso ---
// Esta função verifica a sessão assim que o script é carregado
async function verificarSessao() {
  const {
    data: { user },
  } = await banco.auth.getUser();

  if (user) {
    // Se o usuário existir, "pula" a tela de login
    window.location.href = "admin.html";
  }
}

// Executa a verificação imediatamente
verificarSessao();
// --------------------------------------

// --- 🐞 Desafio 1: Atalho do Teclado (Enter) ---
document.getElementById("password").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    fazerLogin();
  }
});

// Alterna entre texto escondido e visível
function mostrarSenha() {
  let inputSenha = document.getElementById("password");
  let btnOlho = document.getElementById("btn-olho");

  if (inputSenha.type === "password") {
    inputSenha.type = "text";
    btnOlho.innerText = "🙈";
  } else {
    inputSenha.type = "password";
    btnOlho.innerText = "👁️";
  }
}

async function fazerLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("mensagem");
  const btn = document.getElementById("btn-entrar");

  if (!email || !password) {
    msg.innerText = "Preencha todos os campos!";
    msg.style.color = "orange";
    return;
  }

  btn.innerText = "Verificando...";
  btn.disabled = true;

  const { data, error } = await banco.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    msg.innerText = "Acesso Negado: " + error.message;
    msg.style.color = "red";
    btn.innerText = "Entrar no Painel";
    btn.disabled = false;
  } else {
    msg.innerText = "Acesso concedido! Carregando painel...";
    msg.style.color = "green";
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);
  }
}
