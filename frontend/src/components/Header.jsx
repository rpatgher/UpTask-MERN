import { Link } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import ModalSearcher from "./ModalSearcher";

const Header = () => {
    const { handleSeracher, logoutProjects } = useProjects();
    return (
        <header className="px-4 py-5 bg-white boder-b">
            <div className="md:flex md:justify-between">
                <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">UpTask</h2>
                <div className="flex items-center gap-4 md:flex-row flex-col ">
                    <button
                        type="button"
                        className="uppercase font-bold text-slate-600"
                        onClick={handleSeracher}
                    >Search Project</button>
                    <Link to="/projects" className="font-bold uppercase text-slate-600">Projects</Link>

                    <button
                        type="button"
                        className="text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold"
                        onClick={logoutProjects}
                    >
                        Log Out
                    </button>
                    <ModalSearcher />
                </div>
            </div>

        </header>
    )
}

export default Header
