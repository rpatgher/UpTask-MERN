import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type:String,
        required: true,
        trim: true
    },
    deadline:{
        type: Date,
        default: Date.now()
    },
    customer: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    colaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
},{
    timestamps: true
});

const Project = mongoose.model('Project', ProjectSchema);
export default Project;