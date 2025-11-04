import { Router } from "express";
import fs from 'fs';

const readData = () => JSON.parse(fs.readFileSync('./db/db.json'));
const writeData = (data) => fs.writeFileSync('./db/db.json', JSON.stringify(data, null, 2));

const listsRouter = Router();

/* LISTS */

listsRouter.put('/lists/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const listIndex = data.lists.findIndex(l => l.id === id);

    if (listIndex === -1) return res.status(404).send('Llista no trobada');

    data.lists[listIndex] = { ...data.lists[listIndex], ...req.body };

    writeData(data);

    res.json({ message: "Llista modificada" });
});

listsRouter.post('/lists', (req, res) => {
    const data = readData();
    const body = req.body;
    const newList = { id: data.lists.length + 1, ...body, tasks: [] }; // Initialize tasks array for a new list
    data.lists.push(newList);
    writeData(data);
    res.json(newList);
});

listsRouter.delete('/lists/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const listIndex = data.lists.findIndex(l => l.id === id);
    if (listIndex === -1) return res.status(404).send('Llista no trobada');
    data.lists.splice(listIndex, 1);
    writeData(data);
    res.json({ message: "Llista eliminada" });
});

/* TASKS */

listsRouter.put('/lists/:listId/tasks/:taskId', (req, res) => {
    const data = readData();
    const listId = parseInt(req.params.listId);
    const taskId = parseInt(req.params.taskId);

    const listIndex = data.lists.findIndex(l => l.id === listId);
    if (listIndex === -1) return res.status(404).send('Llista no trobada');

    const taskIndex = data.lists[listIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return res.status(404).send('Tasca no trobada en aquesta llista');

    data.lists[listIndex].tasks[taskIndex] = { ...data.lists[listIndex].tasks[taskIndex], ...req.body };

    writeData(data);

    res.json({ message: "Tasca modificada" });
});

listsRouter.post('/lists/:listId/tasks', (req, res) => {
    const data = readData();
    const listId = parseInt(req.params.listId);
    const body = req.body;

    const listIndex = data.lists.findIndex(l => l.id === listId);
    if (listIndex === -1) return res.status(404).send('Llista no trobada');

    const newTaskId = data.lists[listIndex].tasks.length > 0 ? Math.max(...data.lists[listIndex].tasks.map(t => t.id)) + 1 : 1;
    const newTask = { id: newTaskId, ...body };
    data.lists[listIndex].tasks.push(newTask);
    writeData(data);
    res.json(newTask);
});

listsRouter.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    const data = readData();
    const listId = parseInt(req.params.listId);
    const taskId = parseInt(req.params.taskId);

    const listIndex = data.lists.findIndex(l => l.id === listId);
    if (listIndex === -1) return res.status(404).send('Llista no trobada');

    const taskIndex = data.lists[listIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return res.status(404).send('Tasca no trobada en aquesta llista');

    data.lists[listIndex].tasks.splice(taskIndex, 1);
    writeData(data);
    res.json({ message: "Tasca eliminada" });
});

export default listsRouter;