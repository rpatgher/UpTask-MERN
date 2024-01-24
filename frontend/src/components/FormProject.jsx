import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import Alert from './Alert';

const FormProject = () => {
    const { alert, showAlert, submitProject, project: currentProject } = useProjects();
    const params = useParams();
    const [project, setProject] = useState({
        name: '',
        description: '',
        deadline: '',
        customer: ''
    });

    useEffect(() => {
        if(params.id && currentProject.name){
            setProject({
                ...currentProject,
                deadline: currentProject.deadline?.split('T')[0]
            });
        }
    }, [currentProject]);

    const handleChange = e => {
        setProject({
            ...project,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if(Object.values(project).includes('')){
            showAlert(true, 'All fields are required');
            return;
        }
        await submitProject(project);
        setProject({
            name: '',
            description: '',
            deadline: '',
            customer: ''
        });
    }


    return (
        <form
            className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
            onSubmit={handleSubmit}
        >
            {alert.msg && <Alert alert={alert} />}
            <div className="mb-5">
                <label 
                    htmlFor="name"
                    className="text-gray-700 font-bold uppercase text-sm"
                >Name</label>
                <input 
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Project Name"
                    className="w-full border p-2 mt-2 placeholder-gray-400 rounded-md "
                    value={project.name}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-5">
                <label 
                    htmlFor="description"
                    className="text-gray-700 font-bold uppercase text-sm"
                >Description</label>
                <textarea
                    name="description"
                    id="description"
                    placeholder="Project Description"
                    className="w-full border p-2 mt-2 placeholder-gray-400 rounded-md "
                    value={project.description}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-5">
                <label 
                    htmlFor="deadline"
                    className="text-gray-700 font-bold uppercase text-sm"
                >Deadline</label>
                <input 
                    type="date"
                    name="deadline"
                    id="deadline"
                    className="w-full border p-2 mt-2 placeholder-gray-400 rounded-md "
                    value={project.deadline}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-5">
                <label 
                    htmlFor="customer"
                    className="text-gray-700 font-bold uppercase text-sm"
                >Customer</label>
                <input 
                    type="text"
                    name="customer"
                    id="customer"
                    placeholder="Customer of the Project"
                    className="w-full border p-2 mt-2 placeholder-gray-400 rounded-md "
                    value={project.customer}
                    onChange={handleChange}
                />
            </div>
            <input
                type="submit"
                value={params.id ? 'Save Changes' : 'Create Project'}
                className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
            />
        </form>
    )
}

export default FormProject
