// backend/src/controllers/adminController.js
import { db } from "../config/firebase-admin.js";

export async function listarAlunos(req, res) {
  try {
    const alunosSnap = await db.collection("alunos").get();

    if (alunosSnap.empty) return res.json([]);

    const lista = [];

    for (const alunoDoc of alunosSnap.docs) {
      const aluno = alunoDoc.data();
      const alunoId = alunoDoc.id;

      const horariosSnap = await db
        .collection("horarios")
        .doc(alunoId)
        .collection("listaHorarios")
        .get();

      const horarios = horariosSnap.docs.map(h => {
        const d = h.data();
        return `${d.titulo || ""} ${d.horario || ""}`.trim();
      });

      lista.push({
        id: alunoId,
        nome: aluno.nome || "-",
        email: aluno.email || "-",
        instituicao: aluno.instituicao || "-",
        ultimoLogin: aluno.ultimoLogin || "-",
        horarios: horarios.length > 0 ? horarios : []
      });
    }

    res.json(lista);
  } catch (err) {
    console.error("Erro ao listar alunos:", err);
    res.status(500).json({ error: "Erro ao listar alunos" });
  }
}

export async function excluirAluno(req, res) {
  const { id } = req.params;
  try {
    const horariosSnap = await db
      .collection("horarios")
      .doc(id)
      .collection("listaHorarios")
      .get();

    // usa batch para deletar eficientemente
    const batch = db.batch();
    horariosSnap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();

    await db.collection("alunos").doc(id).delete();

    res.json({ message: "Aluno excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir aluno:", err);
    res.status(500).json({ error: "Erro ao excluir aluno" });
  }
}
