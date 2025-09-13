// backend/src/controllers/horariosController.js
import { db } from "../config/firebase-admin.js";

export const salvarHorario = async (req, res) => {
  try {
    const { userId, titulo, horario, horarioId } = req.body;
    if (!userId || !titulo || !horario) return res.status(400).json({ erro: "Dados incompletos." });

    const listaRef = db.collection("horarios").doc(userId).collection("listaHorarios");

    if (horarioId) {
      await listaRef.doc(horarioId).set({ titulo, horario }, { merge: true });
      return res.json({ mensagem: "Horário editado com sucesso!" });
    } else {
      await listaRef.add({ titulo, horario });
      return res.json({ mensagem: "Horário salvo com sucesso!" });
    }
  } catch (err) {
    console.error("Erro salvarHorario:", err);
    return res.status(500).json({ erro: "Erro ao salvar horário." });
  }
};

export const listarHorarios = async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db
      .collection("horarios")
      .doc(userId)
      .collection("listaHorarios")
      .get();

    const horarios = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(horarios);
  } catch (err) {
    console.error("Erro listarHorarios:", err);
    res.status(500).json({ erro: "Erro ao listar horários." });
  }
};

export const excluirHorario = async (req, res) => {
  try {
    const { userId, horarioId } = req.body;
    await db.collection("horarios").doc(userId).collection("listaHorarios").doc(horarioId).delete();
    res.json({ mensagem: "Horário excluído com sucesso!" });
  } catch (err) {
    console.error("Erro excluirHorario:", err);
    res.status(500).json({ erro: "Erro ao excluir horário." });
  }
};
