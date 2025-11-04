import { Router } from "express";
import fs from 'fs';

// Función para leer los datos de la base de datos
const readData = () => JSON.parse(fs.readFileSync('./db/db.json'));

const viewRouter = Router();

// Middleware para verificar la sesión del usuario en todas las rutas protegidas
viewRouter.use((req, res, next) => {
    const { user } = req.session;
    if (!user) {
        // Si no hay usuario en sesión, redirige a la página de inicio de sesión o muestra un error
        return res.status(403).send('Acceso no autorizado. Por favor, inicia sesión.');
    }
    // Si hay usuario, lo adjunta a req para que las rutas lo puedan usar y pasa al siguiente middleware/ruta
    req.user = user;
    next();
});

// Ruta raíz, redirige a la vista de todas las listas
viewRouter.get('/', (req, res) => {
    res.redirect('/lists');
});

/* RUTAS PARA LISTAS */

// Mostrar todas las listas
viewRouter.get('/lists', (req, res) => {
    const { user } = req.req.user; // Acceder a req.user que adjuntamos en el middleware
    const data = readData().lists;
    res.render('lists', { user, data }); // Asumiendo que tienes un archivo EJS llamado 'lists.ejs'
});

// Mostrar el detalle de una lista específica (y sus tareas)
viewRouter.get('/lists/:id_list', (req, res) => {
    const { user } = req.req.user;
    const id_list = parseInt(req.params.id_list);
    const allData = readData();
    const list = allData.lists.find(l => l.id_list === id_list);

    if (!list) {
        return res.status(404).send('Lista no encontrada');
    }

    // Asegurarse de que las tareas de esta lista estén incluidas en el objeto 'list'
    // La estructura de tu DB ya incluye las tareas dentro de cada lista, así que solo pasamos el objeto 'list' directamente.
    // Si las tareas estuvieran en un array global, necesitaríamos filtrarlas aquí.
    
    res.render('list-detail', { user, list }); // Asumiendo 'list-detail.ejs' para el detalle de la lista
});

// Renderizar formulario para crear una nueva lista
viewRouter.get('/lists/new', (req, res) => {
    const { user } = req.req.user;
    res.render('new-list', { user }); // Asumiendo 'new-list.ejs'
});


/* RUTAS PARA TAREAS */

// Mostrar todas las tareas de una lista específica
viewRouter.get('/lists/:id_list/tasks', (req, res) => {
    const { user } = req.req.user;
    const id_list = parseInt(req.params.id_list);
    const allData = readData();
    const list = allData.lists.find(l => l.id_list === id_list);

    if (!list) {
        return res.status(404).send('Lista no encontrada');
    }
    
    const tasks = list.tasks || []; // Obtener las tareas de la lista, o un array vacío si no hay

    res.render('list-tasks', { user, list, data: tasks }); // Asumiendo 'list-tasks.ejs'
});

// Mostrar el detalle de una tarea específica
viewRouter.get('/tasks/:id_task', (req, res) => {
    const { user } = req.req.user;
    const id_task = parseInt(req.params.id_task);
    const allData = readData();
    
    let task = null;
    // Buscar la tarea en todas las listas
    for (const list of allData.lists) {
        task = list.tasks.find(t => t.id_task === id_task);
        if (task) {
            break; // Tarea encontrada
        }
    }

    if (!task) {
        return res.status(404).send('Tarea no encontrada');
    }
    
    res.render('task-detail', { user, task }); // Asumiendo 'task-detail.ejs'
});

// Renderizar formulario para crear una nueva tarea en una lista específica
viewRouter.get('/lists/:id_list/tasks/new', (req, res) => {
    const { user } = req.req.user;
    const id_list = parseInt(req.params.id_list);
    // Puedes pasar el id_list a la vista para que el formulario sepa a qué lista pertenece
    res.render('new-task', { user, id_list }); // Asumiendo 'new-task.ejs'
});


export default viewRouter;