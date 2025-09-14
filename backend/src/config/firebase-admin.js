import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Caminho correto (mesmo nível do script)
const serviceAccountPath = path.resolve("serviceAccountKey.json");

// Lê o arquivo e converte para objeto
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Inicializa Firebase Admin apenas se não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Instância do Firestore
const db = admin.firestore();

// Exporta admin e db
export { admin, db };
export default admin;
