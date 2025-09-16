// admin.js
// Página de administração: lista, exibe e exclui alunos e seus horários. Só acessível para staff.

// ---------- CONTROLE DE ACESSO ----------
const token = localStorage.getItem("token");
const tipoUsuario = localStorage.getItem("tipoUsuario");

// Redireciona se não estiver logado ou não for admin
if (!token || tipoUsuario !== "admin") {
    window.location.href = "index.html";
}

let listaAlunos = []; // guarda todos os alunos carregados

// ---------- CARREGA ALUNOS ----------
async function carregarAlunos() {
    const corpo = document.getElementById("corpoTabelaAlunos");
    corpo.innerHTML = `<tr><td colspan="6" class="no-data">Carregando alunos...</td></tr>`;

    try {
        // URL corrigida para bater com o backend
        const res = await fetch("/admin", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error("Erro ao buscar alunos");

        listaAlunos = await res.json();

        if (listaAlunos.length === 0) {
            corpo.innerHTML = `<tr><td colspan="6" class="no-data">Nenhum aluno cadastrado.</td></tr>`;
            return;
        }

        renderizarAlunos(listaAlunos);

    } catch (err) {
        console.error("Erro ao carregar alunos:", err);
        corpo.innerHTML = `<tr><td colspan="6" class="no-data">Erro ao carregar alunos. Verifique o console.</td></tr>`;
    }
}

// ---------- RENDERIZA ALUNOS ----------
function renderizarAlunos(alunos) {
    const corpo = document.getElementById("corpoTabelaAlunos");
    corpo.innerHTML = "";

    if (alunos.length === 0) {
        corpo.innerHTML = `<tr><td colspan="6" class="no-data">Nenhum aluno encontrado.</td></tr>`;
        return;
    }

    for (const aluno of alunos) {
        corpo.innerHTML += `
            <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.instituicao}</td>
                <td>${aluno.ultimoLogin}</td>
                <td>${Array.isArray(aluno.horarios) ? aluno.horarios.join(", ") : "-"}</td>
                <td>
                    <button class="delete-btn" data-id="${aluno.id}" title="Excluir">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0,0,256,256">
                          <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
                            <g transform="scale(9.84615,9.84615)">
                              <path d="M11,-0.03125c-0.83594,0 -1.65625,0.16406 -2.25,0.75c-0.59375,0.58594 -0.78125,1.41797 -0.78125,2.28125h-3.96875c-0.55078,0 -1,0.44922 -1,1h-1v2h22v-2h-1c0,-0.55078 -0.44922,-1 -1,-1h-3.96875c0,-0.86328 -0.1875,-1.69531 -0.78125,-2.28125c-0.59375,-0.58594 -1.41406,-0.75 -2.25,-0.75zM11,2.03125h4c0.54688,0 0.71875,0.12891 0.78125,0.1875c0.0625,0.05859 0.1875,0.22266 0.1875,0.78125h-5.9375c0,-0.55859 0.125,-0.72266 0.1875,-0.78125c0.0625,-0.05859 0.23438,-0.1875 0.78125,-0.1875zM4,7v16c0,1.65234 1.34766,3 3,3h12c1.65234,0 3,-1.34766 3,-3v-16zM8,10h2v12h-2zM12,10h2v12h-2zM16,10h2v12h-2z"></path>
                            </g>
                          </g>
                        </svg>
                    </button>
                </td>
            </tr>
        `;
    }

    // Evento de exclusão
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const alunoIdParaExcluir = event.currentTarget.dataset.id;
            excluirAluno(alunoIdParaExcluir);
        });
    });
}

// ---------- EXCLUI ALUNO ----------
async function excluirAluno(alunoId) {
    if (confirm("Tem certeza que deseja excluir este aluno e todos os seus horários registrados?")) {
        try {
            const res = await fetch(`/admin/${alunoId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Erro ao excluir aluno");

            alert("Aluno excluído com sucesso!");
            carregarAlunos();
        } catch (error) {
            console.error("Erro ao excluir aluno:", error);
            alert("Erro ao excluir aluno: " + error.message);
        }
    }
}

// ---------- FILTRO DE PESQUISA ----------
document.getElementById("barraPesquisa").addEventListener("keyup", (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = listaAlunos.filter(aluno => 
        aluno.nome.toLowerCase().includes(termo) ||
        aluno.email.toLowerCase().includes(termo) ||
        aluno.instituicao.toLowerCase().includes(termo) ||
        aluno.ultimoLogin.toLowerCase().includes(termo) ||
        (Array.isArray(aluno.horarios) ? aluno.horarios.join(" ").toLowerCase() : "").includes(termo)
    );
    renderizarAlunos(filtrados);
});

// ---------- LOGOUT ----------
window.logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tipoUsuario");
    window.location.href = "index.html";
};

// ---------- MENU LATERAL ----------
window.toggleMenu = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const menuBtn = document.querySelector(".menu-btn");

    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
    menuBtn.classList.toggle("hidden");
};

// ---------- INICIALIZA ----------
carregarAlunos();
