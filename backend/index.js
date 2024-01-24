import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';


import connectDB from './config/db.js';
import userRoutes from './routes/UserRoutes.js';
import projectRoutes from './routes/ProjectRoutes.js';
import taskRoutes from './routes/TaskRoutes.js';

dotenv.config({path: '.env'});

const app = express();
app.use(express.json());

connectDB();

// CORS
const whitelist = [process.env.FRONTEND_URL_DEV, process.env.FRONTEND_URL_PROD];
const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}
app.use(cors(corsOptions));

// Routing
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});


// Socket.io
import { Server } from 'socket.io';
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: [process.env.FRONTEND_URL_DEV, process.env.FRONTEND_URL_PROD]
    }
});

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // Socket events
    socket.on('join-project', (projectId) => {
        socket.join(projectId);
        console.log(`User ${socket.id} joined project ${projectId}`);
    });

    // New Task
    socket.on('new-task', task => {
        socket.to(task.project).emit('task-created', task);
    });

    // Edit Task
    socket.on('edit-task', task => {
        socket.to(task.project._id).emit('task-updated', task);
    });

    // Delete Task
    socket.on('delete-task', task => {
        socket.to(task.project._id).emit('task-deleted', task);
    });

    // Complete Task
    socket.on('complete-task', task => {
        socket.to(task.project._id).emit('task-completed', task);
    });
});