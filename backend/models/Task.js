import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: Boolean,
        default: false        
    },
    deadline: {
        type: Date,
        required: true,
        default: Date.now()
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high']
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    completed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},{
    timestamps: true
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;