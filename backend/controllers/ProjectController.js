import Project from '../models/Project.js'
import Task from '../models/Task.js';
import User from '../models/User.js';

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                {colaborators: {$in: req.user._id}},
                {creator: {$in: req.user._id}}
            ]
        })
        res.json(projects);
    } catch (error) {
        console.log(error);
    }
}

const getProject = async (req, res) => {
    const {id} = req.params;
    const project = await Project.findById(id).populate('colaborators', '-password -confirmed -createdAt -updatedAt -token -__v');
    if(!project){
        const error = new Error('Project not found');
        return res.status(404).json({msg: error.message});
    }
    if(project.creator.toString() !== req.user._id.toString() && !project.colaborators.some(colaborators => colaborators._id.toString() === req.user._id.toString())){
        const error = new Error('Action not allowed');
        return res.status(401).json({msg: error.message});
    }
    // Get tasks
    try {
        const tasks = await Task.find({project: project._id}).populate('completed', '-password -confirmed -createdAt -updatedAt -token -__v');;
        res.json({project, tasks});
    } catch (error) {
        console.log(error);
    }
}

const createProject = async (req, res) => {
    const project = new Project(req.body);
    project.creator = req.user._id;
    try {
        const savedProject = await project.save();
        res.json({msg: 'Project created successfully', project: savedProject});
    } catch (error) {
        console.log(error);
    }
}

const updateProject = async (req, res) => {
    const {id} = req.params;
    const project = await Project.findById(id);
    if(!project){
        const error = new Error('Project not found');
        return res.status(404).json({msg: error.message});
    }
    if(project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Action not allowed');
        return res.status(401).json({msg: error.message});
    }
    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.deadline = req.body.deadline || project.deadline;
    project.customer = req.body.customer || project.customer;
    try {
        const savedProject = await project.save();
        res.json({msg: 'Project updated successfully', project: savedProject});
    } catch (error) {
        console.log(error);
    }
}

const deleteProject = async (req, res) => {
    const {id} = req.params;
    const project = await Project.findById(id);
    if(!project){
        const error = new Error('Project not found');
        return res.status(404).json({msg: error.message});
    }
    if(project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Action not allowed');
        return res.status(401).json({msg: error.message});
    }
    try {
        await project.deleteOne();
        res.json({msg: 'Project deleted successfully'});
    } catch (error) {
        console.log(error);
    }
}

const searchCollaborator = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email}).select('-password -confirmed -createdAt -updatedAt -token -__v');
    if(!user){
        const error = new Error('User not found');
        return res.status(404).json({msg: error.message});
    }
    res.json({msg: 'User found', user});
}

const addCollaborator = async (req, res) => {
    const project = await Project.findById(req.params.id);
    if(!project){
        const error = new Error('Project not found');
        return res.status(404).json({msg: error.message});
    }
    if(project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Action not allowed');
        return res.status(404).json({msg: error.message});
    }
    const {email} = req.body;
    const user = await User.findOne({email}).select('-password -confirmed -createdAt -updatedAt -token -__v');
    if(!user){
        const error = new Error('User not found');
        return res.status(404).json({msg: error.message});
    }
    if(project.creator.toString() === user._id.toString()){
        const error = new Error('You cannot add yourself');
        return res.status(404).json({msg: error.message});
    }
    if(project.colaborators.includes(user._id)){
        const error = new Error('User already added');
        return res.status(404).json({msg: error.message});
    }
    project.colaborators.push(user._id);
    try {
        const savedProject = await project.save();
        res.json({msg: 'Collaborator added successfully', project: savedProject});
    } catch (error) {
        console.log(error);
    }
}

const removeCollaborator = async (req, res) => {
    const project = await Project.findById(req.params.id);
    if(!project){
        const error = new Error('Project not found');
        return res.status(404).json({msg: error.message});
    }
    if(project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Action not allowed');
        return res.status(404).json({msg: error.message});
    }
    const { id } = req.body;
    const user = await User.findById(id).select('-password -confirmed -createdAt -updatedAt -token -__v');
    if(!user){
        const error = new Error('User not found');
        return res.status(404).json({msg: error.message});
    }
    if(project.creator.toString() === user._id.toString()){
        const error = new Error('You cannot remove yourself');
        return res.status(404).json({msg: error.message});
    }
    if(!project.colaborators.includes(user._id)){
        const error = new Error('User not found');
        return res.status(404).json({msg: error.message});
    }
    project.colaborators.pull(req.body.id);
    try {
        const savedProject = await project.save();
        res.json({msg: 'Collaborator deleted successfully', project: savedProject});
    } catch (error) {
        console.log(error);
    }
}

export{
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    searchCollaborator,
    addCollaborator,
    removeCollaborator
}