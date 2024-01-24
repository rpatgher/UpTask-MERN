import { useState } from 'react';
import { Link } from 'react-router-dom';

import clientAxios from "../config/clientAxios";

// ************** Components **************
import Alert from '../components/Alert';

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const [alert, setAlert] = useState({});

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(Object.values(user).includes('')){
            setAlert({
                error: true,
                msg: 'Please fill in all fields'
            });
            setUser({
                ...user,
                password: '',
                password2: ''
            });
            return;
        }
        if(user.password !== user.password2){
            setAlert({
                error: true,
                msg: 'Passwords do not match'
            });
            setUser({
                ...user,
                password: '',
                password2: ''
            });
            return;
        }
        if(user.password.length < 6){
            setAlert({
                error: true,
                msg: 'Password must be at least 6 characters long'
            });
            return;
        }
        setAlert({});
        try {
            const {data} = await clientAxios.post('/users', user);
            setAlert({
                error: false,
                msg: data.msg
            });
            setUser({
                name: '',
                email: '',
                password: '',
                password2: ''
            });
        } catch (error) {
            setAlert({
                error: true,
                msg: error.response.data.msg
            });
            setUser({
                ...user,
                password: '',
                password2: ''
            });
        }
    }

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">Create an account and manage your <span className="text-slate-700">projects</span></h1>
            {alert.msg && <Alert alert={alert} />}
            <form 
                className="my-10 bg-white shadow rounded-lg p-10"
                onSubmit={handleSubmit}
            >
                <div className="my-5">
                    <label htmlFor="name" className="text-gray-600 uppercase block font-bold text-xl">Name</label>
                    <input 
                        type="text" 
                        id="name"
                        name='name'
                        placeholder="Your name"
                        className="w-full mt-3 p-3 boder rounded-xl bg-gray-50"
                        onChange={handleChange}
                        value={user.name}
                    />
                </div>
                <div className="my-5">
                    <label htmlFor="email" className="text-gray-600 uppercase block font-bold text-xl">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        name='email'
                        placeholder="Your email"
                        className="w-full mt-3 p-3 boder rounded-xl bg-gray-50"
                        onChange={handleChange}
                        value={user.email}
                    />
                </div>
                <div className="my-5">
                    <label htmlFor="password" className="text-gray-600 uppercase block font-bold text-xl">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        name='password'
                        placeholder="Your password"
                        className="w-full mt-3 p-3 boder rounded-xl bg-gray-50"
                        onChange={handleChange}
                        value={user.password}
                    />
                </div>
                <div className="my-5">
                    <label htmlFor="password2" className="text-gray-600 uppercase block font-bold text-xl">Confirm Password</label>
                    <input 
                        type="password" 
                        id="password2"
                        name='password2'
                        placeholder="Confirm your password"
                        className="w-full mt-3 p-3 boder rounded-xl bg-gray-50"
                        onChange={handleChange}
                        value={user.password2}
                    />
                </div>
                <input 
                    type="submit" 
                    value="Register" 
                    className="bg-sky-700 w-full py-3 mb-5 text-white font-bold uppercase rounded hover:bg-sky-800 hover:cursor-pointer transition-colors"
                />
            </form>
            <nav className="lg:flex lg:justify-between">
                <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">Have an account? Log in</Link>
                <Link to="/forgot-password" className="block text-center my-5 text-slate-500 uppercase text-sm">Forgot password?</Link>
            </nav>
        </>
    )
}

export default Register
