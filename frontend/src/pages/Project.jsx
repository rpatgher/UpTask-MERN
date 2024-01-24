import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import useProjects from '../hooks/useProjects';
import useAuth from '../hooks/useAuth';
import useAdmin from '../hooks/useAdmin';

import Task from '../components/Task';
import ModalFormTask from '../components/ModalFormTask';
import ModalDeleteTask from '../components/ModalDeleteTask';
import Collaborator from '../components/Collaborator';
import Alert from '../components/Alert';
import ModalDeleteCollaborator from '../components/ModalDeleteCollaborator';

import io from 'socket.io-client';
let socket;

const Project = () => {
    const { id } = useParams();
    const { getProject, project, handleNewTask, tasks, socketNewTask, socketUpdateTask, socketDeleteTask, socketCompleteTask } = useProjects();

    const admin = useAdmin();

    useEffect(() => {
        return () => getProject(id);
    }, []);

    useEffect(() => {
        socket = io(import.meta.env.VITE_API_URL);
        socket.emit('join-project', id);
    }, []);

    useEffect(() => {
        socket.on('task-created', (newTask) => {
            socketNewTask(newTask);
        });
        socket.on('task-updated', (updatedTask) => {
            socketUpdateTask(updatedTask);
        });
        socket.on('task-deleted', (deletedTask) => {
            socketDeleteTask(deletedTask);
        });
        socket.on('task-completed', (completedTask) => {
            socketCompleteTask(completedTask);
        });
    });

    const { name, colaborators  } = project;

    return (
        // alert.msg && alert.error ?
        //     alert.msg && <Alert alert={alert} /> : (
            <>
                <div className='flex justify-between items-center'>
                    <h1 className='font-black text-4xl'>{name}</h1>
                    {admin && (
                        <div className='flex items-center gap-2 text-gray-400 hover:text-black'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                            <Link 
                                to={`/projects/edit/${id}`}
                                className='uppercase font-bold text-xl'
                            >
                                Edit
                            </Link>
                        </div>
                    )}
                </div>
                {admin && (
                    <button
                        onClick={handleNewTask}
                        type='button'
                        className='text-sm py-3 px-5 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 hover:bg-sky-500 transition-colors mt-5 text-white text-center flex items-center gap-2'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                        </svg>
                        New Task
                    </button>
                )}
                <p className="font-bold text-xl mt-10">Tasks of the Project</p>

                <div className="flex justify-center">
                    <div className="md:w-1/3 ld:w-1/4">
                        {/* {alert.msg && <Alert alert={alert} />} */}
                    </div>
                </div>
                <div className="shadow bg-white mt-10 rounded-lg">
                    {tasks.length ? (
                        tasks.map(task => (
                            <Task 
                                key={task._id}
                                task={task}
                            />
                        ))
                    ) : (
                        <p className="text-center my-5 p-10">There are no tasks yet</p>
                    ) }
                </div>
                {admin && (
                    <>
                        <div className="flex items-center justify-between mt-10">
                            <p className="font-bold text-xl">Collaborators</p>
                            <div className="flex items-center justify-between gap-2 text-gray-400 hover:text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <Link 
                                    to={`/projects/new-collaborator/${project._id}`}
                                    className='uppercase font-bold text-xl'
                                >Add</Link>
                            </div>
                        </div>
                        <div className="shadow bg-white mt-10 rounded-lg">
                            {colaborators?.length ? (
                                colaborators?.map(collaborator => (
                                    <Collaborator
                                        key={collaborator._id}
                                        collaborator={collaborator}
                                    />
                                ))
                            ) : (
                                <p className="text-center my-5 p-10">There are no collaborators in this project yet</p>
                            ) }
                        </div>
                    </>
                )}


                <ModalFormTask />
                <ModalDeleteTask />
                <ModalDeleteCollaborator />
            </>
        // )
    )
}

export default Project
