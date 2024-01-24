import Project from "../models/Project.js";
import Task from "../models/Task.js";

const getTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id).populate("project");
    if (!task){
        const error = new Error('Task not found');
        return res.status(404).json({ message: error.message });
    }
    if(task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error('You are not the owner of this task');
        return res.status(403).json({ message: error.message });
    }
    res.json(task);
}

const createTask = async (req, res) => {
    const { project } = req.body;
    const projectExists = await Project.findById(project);
    if (!projectExists){
        const error = new Error('Project not found');
        return res.status(404).json({ message: error.message });
    }
    if(projectExists.creator.toString() !== req.user._id.toString()){
        const error = new Error('You are not the owner of this task');
        return res.status(403).json({ message: error.message });
    }
    try {
        const task = await Task.create(req.body);
        res.json({ msg: 'Task created successfully', task});
    } catch (error) {
        console.log(error);
    }

}

const updateTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id).populate("project");
    if (!task){
        const error = new Error('Task not found');
        return res.status(404).json({ message: error.message });
    }
    if(task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error('You are not the owner of this task');
        return res.status(403).json({ message: error.message });
    }
    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.deadline = req.body.deadline || task.deadline;
    try {
        const savedTask = await task.save();
        res.json({ msg: 'Task updated successfully', task: savedTask});
    } catch (error) {
        console.log(error);
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id).populate("project");
    if (!task){
        const error = new Error('Task not found');
        return res.status(404).json({ message: error.message });
    }
    if(task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error('You are not the owner of this task');
        return res.status(403).json({ message: error.message });
    }
    try {
        await task.deleteOne();
        res.json({msg: 'Task deleted successfully', task});
    } catch (error) {
        console.log(error);
    }
}

const changeStatus = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id).populate("project");
    if (!task){
        const error = new Error('Task not found');
        return res.status(404).json({ message: error.message });
    }
    if(task.project.creator.toString() !== req.user._id.toString() && !task.project.colaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())){
        const error = new Error('You are not the owner of this task');
        return res.status(403).json({ message: error.message });
    }
    task.status = !task.status;
    task.completed = req.user._id;
    try {
        await task.save();
        const allTask = await Task.findById(id).populate("project").populate("completed", "name email _id");
        res.json({ msg: 'Task updated successfully', task: allTask});
    } catch (error) {
        console.log(error);
    }
}


export{
    getTask,
    createTask,
    updateTask,
    deleteTask,
    changeStatus
}