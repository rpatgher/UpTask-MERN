import { useEffect } from "react";
import useProjects from "../hooks/useProjects";
import PreviewProject from "../components/PreviewProject";

const Projects = () => {
    const { projects } = useProjects();

    return (
        <>
            <h1 className="text-4xl font-black">Projects</h1>
            <div className="bg-white shadoe mt-10 rounded-lg">
                {projects.length ? 
                    projects.map(project => (
                        <PreviewProject
                            key={project._id}
                            project={project}
                        />
                    ))
                : (
                    <p className="text-center text-gray-600 uppercase p-5">You don't have projects yet</p>
                )}
            </div>
        </>
    )
}

export default Projects
