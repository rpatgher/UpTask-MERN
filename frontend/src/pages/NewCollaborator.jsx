import { useEffect } from "react"
import { useParams } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import FormCollaborator from "../components/FormCollaborator"
import Alert from "../components/Alert";

const NewCollaborator = () => {
    const { id } = useParams();
    const { getProject, project, collaborator, addCollaborator, alert } = useProjects();

    useEffect(() => {
        return () => getProject(id);
    }, []);

    if(!project._id) return <Alert alert={alert} />;

    return (
        <>
            <h1 className="text-4xl font-black">Add Collaborator to Project: {project.name}</h1>
            <div className="mt-10 flex justify-center">
                <FormCollaborator />
            </div>
            {collaborator._id && (
                <div className="flex justify-center mt-10">
                    <div className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow">
                        <h2 className="text-center mb-10 text-2xl font-bold">Result:</h2>
                        <div className="flex justify-between items-center">
                            <p className="text-xl">{collaborator.name}</p>
                            <button
                                type="button"
                                className="bg-slate-500 hover:bg-slate-700 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm"
                                onClick={() => addCollaborator({email: collaborator.email})}
                            >Add to Project</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NewCollaborator
