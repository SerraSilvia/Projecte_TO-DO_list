import { Router } from "express";
import fs from 'fs';

const readData = () => JSON.parse(fs.readFileSync('./db/db.json'));

const viewRouter = Router();

// Middleware para verificar sesión
viewRouter.use((req, res, next) => {
    const { user } = req.session;
    if (!user) {
        return res.status(403).send('Acceso no autorizado. Por favor, inicia sesión.');
    }
    req.user = user;
    next();
});

// Redirección raíz
viewRouter.get('/', (req, res) => {
    res.redirect('/lists');
});

/* === LISTAS === */

// Todas las listas
viewRouter.get('/lists', (req, res) => {
    const user = req.user;
    const data = readData().lists;
    res.render('lists', { user, data }); // ✅ lists.ejs
});

// Detalle de una lista (sus tareas)
viewRouter.get('/lists/:id_list', (req, res) => {
    const user = req.user;
    const id_list = parseInt(req.params.id_list);
    const allData = readData();
    const list = allData.lists.find(l => l.id_list === id_list);

    if (!list) return res.status(404).send('Lista no encontrada');

    res.render('list', { user, list }); // ✅ list.ejs
});

// Formulario nueva lista
viewRouter.get('/lists/new', (req, res) => {
    const user = req.user;
    res.render('new-list', { user });
});

/* === TAREAS === */

// Todas las tareas de una lista
viewRouter.get('/lists/:id_list/tasks', (req, res) => {
    const user = req.user;
    const id_list = parseInt(req.params.id_list);
    const allData = readData();
    const list = allData.lists.find(l => l.id_list === id_list);

    if (!list) return res.status(404).send('Lista no encontrada');

    const tasks = list.tasks || [];
    res.render('tasks', { user, list, data: tasks }); // ✅ tasks.ejs
});

// Detalle de una tarea
viewRouter.get('/tasks/:id_task', (req, res) => {
    const user = req.user;
    const id_task = parseInt(req.params.id_task);
    const allData = readData();

    let task = null;
    for (const list of allData.lists) {
        task = list.tasks.find(t => t.id_task === id_task);
        if (task) break;
    }

    if (!task) return res.status(404).send('Tarea no encontrada');

    res.render('task', { user, task }); // ✅ task.ejs
});

// Formulario nueva tarea
viewRouter.get('/lists/:id_list/tasks/new', (req, res) => {
    const user = req.user;
    const id_list = parseInt(req.params.id_list);
    res.render('new-task', { user, id_list });
});

export default viewRouter;
