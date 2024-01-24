import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ************** Axios **************
import clientAxios from "../config/clientAxios";

// ************** Hooks for Context **************
import useAuth from '../hooks/useAuth';

// ************** Components **************
import Alert from '../components/Alert';

const Login = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const [alert, setAlert] = useState({});

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.id]: e.target.value
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
                password: ''
            });
            return;
        }
        setAlert({});
        try {
            const {data} = await clientAxios.post('/users/login', user);
            setAuth(data);
            localStorage.setItem('token', data.token);
            navigate('/projects');
        } catch (error) {
            setAlert({
                error: true,
                msg: error.response.data.msg
            });
        }
    }
    
    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">Log in and manage your <span className="text-slate-700">projects</span></h1>
            {alert.msg && <Alert alert={alert} />}
            <form 
                className="my-10 bg-white shadow rounded-lg p-10"
                onSubmit={handleSubmit}
            >
                <div className="my-5">
                    <label htmlFor="email" className="text-gray-600 uppercase block font-bold text-xl">Email</label>
                    <input 
                        type="email" 
                        id="email"
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
                        placeholder="Your password"
                        className="w-full mt-3 p-3 boder rounded-xl bg-gray-50"
                        onChange={handleChange}
                        value={user.password}
                    />
                </div>
                <input 
                    type="submit" 
                    value="Log in" 
                    className="bg-sky-700 w-full py-3 mb-5 text-white font-bold uppercase rounded hover:bg-sky-800 hover:cursor-pointer transition-colors"
                />
            </form>
            <nav className="lg:flex lg:justify-between">
                <Link to="/register" className="block text-center my-5 text-slate-500 uppercase text-sm">Don't have an account? Sign up</Link>
                <Link to="/forgot-password" className="block text-center my-5 text-slate-500 uppercase text-sm">Forgot password?</Link>
            </nav>
        </>
    )
}

export default Login
