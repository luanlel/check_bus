// backend/src/middlewares/authMiddleware.js
import { admin } from "../config/firebase-admin.js";

export const verificarAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ erro: "Token não fornecido" });

    const decoded = await admin.auth().verifyIdToken(token);

    if ((decoded.email || "").toLowerCase() !== "staff@adm.com") {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Erro no verificarAdmin:", err);
    res.status(401).json({ erro: "Token inválido" });
  }
};
