import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Ajustes para usar __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho da chave privada (JSON que você baixou do Firebase)
const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, "../../serviceAccountKey.json"), "utf8")
);

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
