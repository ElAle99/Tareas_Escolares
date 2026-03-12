const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/horarios.controller');



// http://localhost:3000/api/horarios                     metodo: POST crear nuevo horario
// http://localhost:3000/api/horarios/materia/:id_materia metodo: GET consultar horarios por materia
// http://localhost:3000/api/horarios                     metodo: GET obtener horario completo del usuario
// http://localhost:3000/api/horarios/:id                 metodo: PUT actualizar horario por id
// http://localhost:3000/api/horarios/:id                 metodo: DELETE eliminar horario por id

router.post('/', verificarToken, controller.crearHorario);  // se necesita: id_materia, dia_semana, hora_inicio, hora_fin
router.get('/materia/:id_materia', verificarToken, controller.obtenerHorariosPorMateria);
router.get('/', verificarToken, controller.obtenerHorarioCompleto);
router.put('/:id', verificarToken, controller.actualizarHorario);
router.delete('/:id', verificarToken, controller.eliminarHorario);

module.exports = router;
