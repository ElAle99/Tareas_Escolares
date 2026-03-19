const pool = require('./src/config/db');

(async () => {
  try {
    await pool.query("ALTER TABLE materias ADD COLUMN color VARCHAR(7) DEFAULT '#3B82F6';");
    console.log("Columna 'color' agregada a materias.");
  } catch (err) {
    if (err.code === '42701') {
      console.log("La columna 'color' ya existe.");
    } else {
      console.error("Error al alterar la tabla:", err);
    }
  } finally {
    pool.end();
  }
})();
