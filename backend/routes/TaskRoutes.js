import express from "express";

import {
    getTask,
    createTask,
    updateTask,
    deleteTask,
    changeStatus
} from '../controllers/TaskController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Tasks Routes
router.post('/', checkAuth, createTask);

router.route('/:id')
    .get(checkAuth, getTask)
    .put(checkAuth, updateTask)
    .delete(checkAuth, deleteTask);

router.post('/change-status/:id', checkAuth, changeStatus);



export default router;