const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/materias.controller');

// Crear materia
router.post('/', verificarToken, controller.crearMateria);

// Listar todas las materias
// http://localhost:3000/api/materias metodo: GET todas las materias del usuario
router.get('/', verificarToken, controller.obtenerTodasLasMaterias);


// Listar materias por periodo
router.get('/:id_periodo', verificarToken, controller.obtenerMateriasPorPeriodo);

// Obtener detalle de una materia
router.get('/detalle/:id', verificarToken, controller.obtenerMateriaPorId);

// Actualizar materia
router.put('/:id', verificarToken, controller.actualizarMateria);

// Eliminar materia
router.delete('/:id', verificarToken, controller.eliminarMateria);

module.exports = router;
