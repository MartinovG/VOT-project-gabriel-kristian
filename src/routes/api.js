import { Router } from 'express';

export const router = Router();

let tasks = [
    { id: 1, title: 'Да настроим CI/CD с Jenkins', status: 'done' },
    { id: 2, title: 'Да разгърнем инфраструктурата с Terraform', status: 'pending' },
    { id: 3, title: 'Да покрием проекта с Unit тестове', status: 'pending' }
];
let nextId = 4;

router.get('/tasks', (req, res) => {
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

router.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    res.status(200).json({ success: true, data: task });
});

router.post('/tasks', (req, res) => {
    const { title, status } = req.body;
    
    if (!title) {
        return res.status(400).json({ success: false, error: 'Title is required' });
    }
    
    const newTask = {
        id: nextId++,
        title,
        status: status || 'pending'
    };
    
    tasks.push(newTask);
    res.status(201).json({ success: true, data: newTask });
});

router.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, status } = req.body;
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...title && { title },
        ...status && { status }
    };
    
    res.status(200).json({ success: true, data: tasks[taskIndex] });
});

router.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const deletedTask = tasks.splice(taskIndex, 1);
    res.status(200).json({ success: true, data: deletedTask[0] });
});
