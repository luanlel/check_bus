// backend/src/controllers/relatorioController.js
import { db } from "../config/firebase-admin.js";

export async function listarRelatorios(req, res) {
  try {
    const registrosRef = db.collection("acessos");
    const snapshot = await registrosRef.orderBy("data", "desc").get();

    if (snapshot.empty) return res.json([]);

    const lista = snapshot.docs.map(docSnap => {
      const dados = docSnap.data();
      return {
        id: docSnap.id,
        uid: dados.uid || "UID Desconhecido",
        idCartao: docSnap.id,          // <-- corrigido
        data: dados.data || "Data Desconhecida",
        horario: dados.horario || "Hora Desconhecida"
      };
    });

    res.json(lista);
  } catch (err) {
    console.error("Erro ao listar relatórios:", err);
    res.status(500).json({ error: "Erro ao listar relatórios" });
  }
}

export async function excluirRelatorio(req, res) {
  const { id } = req.params;
  try {
    await db.collection("acessos").doc(id).delete();
    res.json({ message: "Registro excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir relatório:", err);
    res.status(500).json({ error: "Erro ao excluir relatório" });
  }
}
