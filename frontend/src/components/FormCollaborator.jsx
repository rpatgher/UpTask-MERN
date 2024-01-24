import { useState, useEffect } from "react";

import useProjects from "../hooks/useProjects";
import Alert from "./Alert";

const FormCollaborator = () => {
    const [email, setEmail] = useState('');
    
    const { alert, showAlert, submitCollaborator } = useProjects();

    const handleSubmit = async e => {
        e.preventDefault();
        if(email === ''){
            showAlert(true, 'Email is required');
            return;
        }
        showAlert(false, '');
        await submitCollaborator(email);
        setEmail('');
    }

    

    return (
        <form
            className="bg-white py-10 px-5 w-full lg:w-1/2 rounded-lg shadow"
            onSubmit={handleSubmit}
        >
            {alert.msg && <Alert alert={alert} />}
            <div className='mb-5'>
                <label 
                    htmlFor="email"
                    className='text-gray-700 uppercase font-bold text-sm'
                >Email</label>
                <input 
                    type="email" 
                    id='email'
                    name='email'
                    placeholder='Collaborator Email'
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <input 
                type="submit" 
                value='Search Collaborator'
                className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold rounded transition-colors cursor-pointer text-sm'
            />
        </form>
    )
}

export default FormCollaborator
