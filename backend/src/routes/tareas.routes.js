const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/tareas.controller');

// endpoints para tareas

//http://localhost:3000/api/tareas metdod: POST nueva tarea
//http://localhost:3000/api/tareas metodo: GET todas las tareas
//http://localhost:3000/api/tareas/:id metodo: GET una tarea por id
//http://localhost:3000/api/tareas/:id metodo: PUT actualizar una tarea por id
//http://localhost:3000/api/tareas/:id/completar metodo: PATCH marcar una tarea como completada
//http://localhost:3000/api/tareas/:id metodo: DELETE eliminar una tarea por id

//http://localhost:3000/api/tareas/estado/vencidas metodo: GET tareas vencidas
//http://localhost:3000/api/tareas/estado/completadas metodo: GET tareas completadas
//http://localhost:3000/api/tareas/materia/:id_materia metodo: GET tareas por materia

router.post('/', verificarToken, controller.crearTarea); //creasr una nueva tarea

router.get('/', verificarToken, controller.obtenerTodasLasTareas);// ver todas las tareas

router.get('/:id', verificarToken, controller.obtenerTareaPorId);// ver una tarea por id

router.put('/:id', verificarToken, controller.actualizarTarea); // actualizar una tarea por id

router.patch('/:id/completar', verificarToken, controller.marcarComoCompletada); // marcar una tarea como completada

router.delete('/:id', verificarToken, controller.eliminarTarea);// eliminar una tarea por id

// endponits adicionales
// tareas pendientes

router.get('/estado/pendientes', verificarToken, controller.tareasPendientes);// tareas vencidas
router.get('/estado/vencidas', verificarToken, controller.tareasVencidas); // tareas completadas
router.get('/estado/completadas', verificarToken, controller.tareasCompletadas);// tareas por materia

module.exports = router;
