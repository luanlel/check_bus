// seus_horarios.js
import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let userId = null;
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  userId = user.uid;

  // Tipo de usuário do login
  const tipoUsuario = localStorage.getItem("tipoUsuario") || "aluno";

  gerarMenuLateral(tipoUsuario);

  carregarHorarios();
});

// Gera os botões do menu lateral dinamicamente
function gerarMenuLateral(tipoUsuario) {
  sidebar.innerHTML = ""; // Limpa menu

  const menuButtons = [
    { text: "Principal", href: "home_principal.html", tipo: "todos" },
    { text: "Editar Horários", href: "horarios.html", tipo: "todos" },
    { text: "Abrir GPS", href: "gps.html", tipo: "todos" },
    { text: "Relatório", href: "relatorios.html", tipo: "admin" },
    { text: "Lista de Alunos", href: "admin.html", tipo: "admin" },
  ];

  menuButtons.forEach(btn => {
    if (btn.tipo === "todos" || btn.tipo === tipoUsuario) {
      const button = document.createElement("button");
      button.textContent = btn.text;
      button.addEventListener("click", () => location.href = btn.href);
      sidebar.appendChild(button);
    }
  });

  // Botão logout
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Sair";
  logoutBtn.className = "logout";
  logoutBtn.addEventListener("click", logout);
  sidebar.appendChild(logoutBtn);
}

// Carrega horários
async function carregarHorarios() {
  if (!userId) return;

  try {
    const horariosRef = collection(db, "horarios", userId, "listaHorarios");
    const horariosSnap = await getDocs(horariosRef);
    const horariosLista = document.getElementById("horariosLista");
    if (!horariosLista) return;

    horariosLista.innerHTML = "";

    if (horariosSnap.empty) {
      horariosLista.innerHTML = "<p>Você ainda não tem horários salvos.</p>";
    } else {
      horariosSnap.forEach(docItem => {
        const data = docItem.data();
        const titulo = data.titulo || "Sem título";
        const horario = data.horario || "--:--";

        const div = document.createElement("div");
        div.classList.add("horario-item");
        div.innerHTML = `
          <span><strong>${titulo}</strong>: ${horario}</span>
          <button onclick="excluirHorario('${docItem.id}')">Excluir</button>
        `;
        horariosLista.appendChild(div);
      });
    }
  } catch (err) {
    const horariosLista = document.getElementById("horariosLista");
    if (horariosLista) horariosLista.innerHTML = "<p>Erro ao carregar horários.</p>";
    console.error(err);
  }
}

// Excluir horário
window.excluirHorario = async (docId) => {
  try {
    const horarioDocRef = doc(db, "horarios", userId, "listaHorarios", docId);
    await deleteDoc(horarioDocRef);
    carregarHorarios();
  } catch (err) {
    alert("Erro ao excluir o horário.");
    console.error(err);
  }
};

// Logout
window.logout = () => {
  signOut(auth).then(() => window.location.href = "index.html");
};

// Toggle menu lateral
window.toggleMenu = () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
};
