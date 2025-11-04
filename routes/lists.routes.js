import { Router } from "express";
import fs from 'fs';

const readData = () => JSON.parse(fs.readFileSync('./db/db.json'));
const writeData = (data) => fs.writeFileSync('./db/db.json', JSON.stringify(data, null, 2));

const listsRouter = Router();

/* LISTS */

// Obtener todas las listas (AGREGAR ESTO PARA QUE LA HOME PUEDA FETCHEARLAS)
listsRouter.get('/lists', (req, res) => {
    const data = readData();
    res.json(data.lists);
});

// Obtener una lista por su ID (útil para la página de detalle de la lista)
listsRouter.get('/lists/:id_list', (req, res) => {
    const data = readData();
    const idList = parseInt(req.params.id_list); // Usar id_list
    const list = data.lists.find(l => l.id_list === idList); // Buscar por id_list

    if (!list) return res.status(404).send('Llista no trobada');
    res.json(list);
});


listsRouter.put('/lists/:id_list', (req, res) => { 
    const data = readData();
    const idList = parseInt(req.params.id_list); 
    const listIndex = data.lists.findIndex(l => l.id_list === idList); 

    if (listIndex === -1) return res.status(404).send('Llista no trobada');

    data.lists[listIndex] = { ...data.lists[listIndex], ...req.body };

    writeData(data);

    res.json({ message: "Llista modificada" });
});

listsRouter.post('/lists', (req, res) => {
    const data = readData();
    const body = req.body;
    // Generar el próximo id_list basado en los existentes
    const newIdList = data.lists.length > 0 ? Math.max(...data.lists.map(l => l.id_list)) + 1 : 1;
    const newList = { id_list: newIdList, ...body, tasks: [] }; 
    data.lists.push(newList);
    writeData(data);
    res.status(201).json(newList); // 201 Created
});

listsRouter.delete('/lists/:id_list', (req, res) => { 
    const data = readData();
    const idList = parseInt(req.params.id_list); 
    const listIndex = data.lists.findIndex(l => l.id_list === idList); 
    if (listIndex === -1) return res.status(404).send('Llista no trobada');
    data.lists.splice(listIndex, 1);
    writeData(data);
    res.json({ message: "Llista eliminada" });
});

/* TASKS */

// Obtener todas las tareas de una lista específica (útil para la página de detalle de la lista)
listsRouter.get('/lists/:id_list/tasks', (req, res) => {
    const data = readData();
    const idList = parseInt(req.params.id_list);
    const list = data.lists.find(l => l.id_list === idList);

    if (!list) return res.status(404).send('Llista no trobada');
    res.json(list.tasks);
});

// Obtener una tarea específica de una lista
listsRouter.get('/lists/:id_list/tasks/:id_task', (req, res) => {
    const data = readData();
    const idList = parseInt(req.params.id_list);
    const idTask = parseInt(req.params.id_task);

    const list = data.lists.find(l => l.id_list === idList);
    if (!list) return res.status(404).send('Llista no trobada');

    const task = list.tasks.find(t => t.id_task === idTask); // Buscar por id_task
    if (!task) return res.status(404).send('Tasca no trobada en aquesta llista');

    res.json(task);
});


listsRouter.put('/lists/:id_list/tasks/:id_task', (req, res) => { 
    const data = readData();
    const idList = parseInt(req.params.id_list); 
    const idTask = parseInt(req.params.id_task); 

    const listIndex = data.lists.findIndex(l => l.id_list === idList); 
    if (listIndex === -1) return res.status(404).send('Llista no trobada');

    const taskIndex = data.lists[listIndex].tasks.findIndex(t => t.id_task === idTask);
    if (taskIndex === -1) return res.status(404).send('Tasca no trobada en aquesta llista');

    data.lists[listIndex].tasks[taskIndex] = { ...data.lists[listIndex].tasks[taskIndex], ...req.body };

    writeData(data);

    res.json({ message: "Tasca modificada" });
});

listsRouter.post('/lists/:id_list/tasks', (req, res) => { 
    const data = readData();
    const idList = parseInt(req.params.id_list);
    const body = req.body;

    const listIndex = data.lists.findIndex(l => l.id_list === idList); 
    if (listIndex === -1) return res.status(404).send('Llista no trobada');

    // Generar el próximo id_task basado en los existentes en ESA lista
    const newIdTask = data.lists[listIndex].tasks.length > 0 ? Math.max(...data.lists[listIndex].tasks.map(t => t.id_task)) + 1 : 1;
    const newTask = { id_task: newIdTask, id_list: idList, ...body }; 
    data.lists[listIndex].tasks.push(newTask);
    writeData(data);
    res.status(201).json(newTask); // 201 Created
});

listsRouter.delete('/lists/:id_list/tasks/:id_task', (req, res) => {
    const data = readData();
    const idList = parseInt(req.params.id_list); 
    const idTask = parseInt(req.params.id_task); 

    const listIndex = data.lists.findIndex(l => l.id_list === idList); 
    if (listIndex === -1) return res.status(404).send('Llista no trobada');

    const taskIndex = data.lists[listIndex].tasks.findIndex(t => t.id_task === idTask); 
    if (taskIndex === -1) return res.status(404).send('Tasca no trobada en aquesta llista');

    data.lists[listIndex].tasks.splice(taskIndex, 1);
    writeData(data);
    res.json({ message: "Tasca eliminada" });
});

export default listsRouter;