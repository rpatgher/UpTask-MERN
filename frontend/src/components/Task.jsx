import { formatDate } from "../helpers/formatDate";
import useProjects from "../hooks/useProjects";
import useAdmin from "../hooks/useAdmin";


const Task = ({task}) => {
    const { name, description, deadline, priority, status, _id, completed } = task;

    const { handleEditTask, handleModalDeleteTask, handleChangeStatus } = useProjects();

    const admin = useAdmin();

    return (
        <div className="border-b p-5 flex justify-between item-center">
            <div>
                <p className="mb-1 text-2xl">{name}</p>
                <p className="mb-1 text-sm text-gray-500 uppercase">{description}</p>
                <p className="mb-1 text-xl">{formatDate(deadline)}</p>
                <p className="mb-1 text-gray-600 capitalize">Priority: {priority}</p>
                { status && <p className="text-sm bg-green-600 uppercase p-1 rounded-lg text-white inline-block">Completed by: {completed.name}</p> }
            </div>
            <div className="flex flex-col md:flex-row gap-2 items-center">
                {admin && (
                    <button
                        type="button"
                        className="bg-indigo-600 hover:bg-indigo-700 w-full transition-colors px-4 py-3 text-white font-bold text-sm rounded-lg"
                        onClick={() => handleEditTask(task)}
                    >Edit</button>
                )}
                <button
                    type="button"
                    className={`${status ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-600 hover:bg-gray-700'} w-full transition-colors px-4 py-3 text-white font-bold text-sm rounded-lg`}
                    onDoubleClick={() => handleChangeStatus(_id)}
                >{status ? 'Complete' : 'Incomplete'}</button>
                {admin && (
                    <button
                        type="button"
                        className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-3 w-full text-white font-bold text-sm rounded-lg"
                        onClick={() => handleModalDeleteTask(task)}
                    >Delete</button>
                )}
            </div>
        </div>
    )
}

export default Task
