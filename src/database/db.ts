import { Pool } from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
});

// Esta función para inicializar la base de datos
export const initializeDatabase = async () => {
    const client = await pool.connect();
    try {
        console.log("🔧 Verificando estructura de la base de datos...");

        const initSQLPath = path.join(__dirname, "init.sql");

        console.log(`📁 Leyendo SQL desde: ${initSQLPath}`);

        // Se verificar si el archivo existe
        if (!fs.existsSync(initSQLPath)) {
            throw new Error(`El archivo ${initSQLPath} no existe`);
        }

        const initSQL = fs.readFileSync(initSQLPath, "utf-8");

        //Se ejecutar el script SQL
        await client.query(initSQL);

        console.log(
            "✅ Estructura de base de datos verificada/creada exitosamente",
        );

        //Se verificar que la tabla messages existe
        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log(
            "📊 Tablas en la base de datos:",
            tables.rows.map((row) => row.table_name).join(", "),
        );
    } catch (error) {
        console.error("❌ Error inicializando la base de datos:", error);
        throw error;
    } finally {
        client.release();
    }
};
