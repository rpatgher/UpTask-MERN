import useProjects from "../hooks/useProjects";

const Collaborator = ({collaborator}) => {
    const { name, email } = collaborator;
    const { handleModalDeleteCollaborator } = useProjects();
    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div className="">
                <p>{name}</p>
                <p className="text-sm text-gray-700">{email}</p>
            </div>
            <div>
                <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 px-4 py-3 text-white font-bold text-sm rounded-lg"
                    onClick={() => handleModalDeleteCollaborator(collaborator)}
                >Delete</button>
            </div>
        </div>
    )
}

export default Collaborator
