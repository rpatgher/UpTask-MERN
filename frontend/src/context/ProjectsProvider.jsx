import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import clientAxios from '../config/clientAxios';
import useAuth from '../hooks/useAuth';

import io from 'socket.io-client';
let socket;

const ProjectsContext = createContext();

const ProjectsProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [alert, setAlert] = useState({});
    const [project, setProject] = useState({});
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({});
    const [loading, setLoading] = useState(false);
    const [modalFormTask, setModalFormTask] = useState(false);
    const [modalDeleteTask, setModalDeleteTask] = useState(false);
    const [collaborator, setCollaborator] = useState({});
    const [modalDeleteCollaborator, setModalDeleteCollaborator] = useState(false);
    const [modalSearcher, setModalSearcher] = useState(false);

    const navigate = useNavigate();
    const { auth, logoutAuth } = useAuth();
    
    useEffect(() => {
        const getProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                if(!token) return;
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clientAxios('/projects', config);
                setProjects(data);
            } catch (error) {
                console.log(error);
            }
        }
        return () => getProjects();
    }, [auth]);

    useEffect(() => {
        socket = io(import.meta.env.VITE_API_URL);
    }, []);

    const showAlert = (error, msg) => {
        setAlert({
            error,
            msg
        });
        setTimeout(() => {
            setAlert({});
        }, 5000);
    }

    const submitProject = async project => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            if(project._id){
                const { data } = await clientAxios.put(`/projects/${project._id}`, project, config);
                setProjects(projects.map(project => project._id === data.project._id ? data.project : project));
                showAlert(false, data.msg);
            }else{
                const { data } = await clientAxios.post('/projects', project, config);
                setProjects([
                    ...projects,
                    data.project
                ]);
                showAlert(false, data.msg);
            }
            setTimeout(() => {
                navigate('/projects');
            }, 2000);

        } catch (error) {
            console.log(error);
            showAlert(true, error.response.data.msg);
        }
    }

    const getProject = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clientAxios(`/projects/${id}`, config);
            setProject(data.project);
            setTasks(data.tasks);
        } catch (error) {
            console.log(error);
            navigate('/projects');
            setAlert({
                error: true,
                msg: error.response.data.msg
            });
        } finally {
            setLoading(false);
        }
    }

    const deleteProject = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clientAxios.delete(`/projects/${id}`, config);
            showAlert(false, data.msg);
            setProjects(projects.filter(project => project._id !== id));
            setTimeout(() => {
                navigate('/projects');
            }, 2000);
        } catch (error) {
            console.log(error);
        }
    }

    const handleModalTask = () => {
        setModalFormTask(!modalFormTask);
    }

    const handleModalDeleteTask  = task => {
        setTask(task);
        setModalDeleteTask(!modalDeleteTask);
    }

    const submitTask = async task => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            if(task._id){
                const { data } = await clientAxios.put(`/tasks/${task._id}`, task, config);
                showAlert(false, data.msg);
                // Socket
                socket.emit('edit-task', data.task);
            }else{
                const {data} = await clientAxios.post('/tasks', task, config);
                showAlert(false, data.msg);
                // Socket
                socket.emit('new-task', data.task);
            }
            setTimeout(() => {
                handleModalTask();
            }, 300);
        } catch (error) {
            console.log(error);
        }
    }

    const handleNewTask = () => {
        setTask({});
        handleModalTask();
    }

    const handleEditTask = task => {
        setTask(task);
        handleModalTask();
    }

    const handleDeleteTask = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clientAxios.delete(`/tasks/${task._id}`, config);
            setModalDeleteTask(false);
            setTask({});
            setAlert({});
            // showAlert(false, data.msg);
            // Socket
            socket.emit('delete-task', data.task);
        } catch (error) {
            console.log(error);
        }
    }

    const submitCollaborator = async email => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clientAxios.post('/projects/collaborators', {email}, config);
            setCollaborator(data.user);
            // showAlert(false, data.msg);
        } catch (error) {
            console.log(error);
            showAlert(true, error.response.data.msg);
            setCollaborator({});
        }
    }

    const addCollaborator = async email => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clientAxios.post(`/projects/collaborators/${project._id}`, email, config);
            showAlert(false, data.msg);
            setCollaborator({});
        } catch (error) {
            console.log(error);
            showAlert(true, error.response.data.msg);
        }
    }

    const handleModalDeleteCollaborator = collaborator => {
        setCollaborator(collaborator);
        setModalDeleteCollaborator(!modalDeleteCollaborator);
    }

    const handleDeleteCollaborator = async () => {;
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clientAxios.post(`/projects/delete-collaborators/${project._id}`, {id: collaborator._id}, config);
            showAlert(false, data.msg);
            const updatedProject = {...project};
            updatedProject.colaborators = updatedProject.colaborators.filter(collaboratorState => collaboratorState._id !== collaborator._id);
            setProject(updatedProject);
            setCollaborator({});
            setModalDeleteCollaborator(false);

        } catch (error) {
            console.log(error);
            showAlert(true, error.response.data.msg);
        }
    }

    const handleChangeStatus = async id => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clientAxios.post(`/tasks/change-status/${id}`, {}, config);
            setTask({});
            setAlert({});
            // Socket.io
            socket.emit('complete-task', data.task);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSeracher = () => {
        setModalSearcher(!modalSearcher);
    }

    const socketNewTask = (task) => {
        setTasks([
            ...tasks,
            task
        ]);
    }

    const socketUpdateTask = (updatedTask) => {
        console.log(updatedTask);
        setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    } 

    const socketDeleteTask = (task) => {
        setTasks(tasks.filter(taskState => taskState._id !== task._id));
    }
    
    const socketCompleteTask = (completedTask) => {
        setTasks(tasks.map(task => task._id === completedTask._id ? completedTask : task));
    }

    const logoutProjects = () => {
        setProjects([]);
        setAlert({});
        setProject({});
        setTasks([]);
        setTask({});
        logoutAuth();
        localStorage.removeItem('token');
    }

    return (
        <ProjectsContext.Provider value={{
            projects,
            alert,
            showAlert,
            submitProject,
            getProject,
            project,
            loading,
            tasks,
            task,
            handleNewTask,
            handleEditTask,
            deleteProject,
            modalFormTask,
            handleModalTask,
            submitTask,
            modalDeleteTask,
            handleModalDeleteTask,
            handleDeleteTask,
            submitCollaborator,
            collaborator,
            addCollaborator,
            modalDeleteCollaborator,
            handleModalDeleteCollaborator,
            handleDeleteCollaborator,
            handleChangeStatus,
            modalSearcher,
            handleSeracher,
            socketNewTask,
            socketUpdateTask,
            socketDeleteTask,
            socketCompleteTask,
            logoutProjects
        }}>
            {children}
        </ProjectsContext.Provider>
    )
}

export { ProjectsProvider }
export default ProjectsContext