import express from "express";

import {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    searchCollaborator,
    addCollaborator,
    removeCollaborator
} from '../controllers/ProjectController.js';

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Projects Routes
router.route('/')
    .get(checkAuth, getProjects)
    .post(checkAuth, createProject);
router.route('/:id')
    .get(checkAuth, getProject)
    .put(checkAuth, updateProject)
    .delete(checkAuth, deleteProject);

router.post('/collaborators', checkAuth, searchCollaborator);
router.post('/collaborators/:id', checkAuth, addCollaborator);
router.post('/delete-collaborators/:id', checkAuth, removeCollaborator);



export default router;