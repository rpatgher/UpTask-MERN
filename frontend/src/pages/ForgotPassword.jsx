import { useState } from 'react';
import { Link } from 'react-router-dom';
import clientAxios from "../config/clientAxios";
import Alert from "../components/Alert";


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState({});

    const handleSubmit = async e => {
        e.preventDefault();
        if (email === ''){
            setAlert({
                error: true,
                msg: 'Email is required'
              });
            return;
        }
        setAlert({});
        try {
            const {data} = await clientAxios.post('/users/forgot-password', { email });
            setAlert({
                error: false,
                msg: data.msg
            });
            setEmail('');
        } catch (error) {
            setAlert({
                error: true,
                msg: error.response.data.msg
            });
        }
    }

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">Recover your access and manage your <span className="text-slate-700">projects</span></h1>
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
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <input 
                    type="submit" 
                    value="Send Instructions" 
                    className="bg-sky-700 w-full py-3 mb-5 text-white font-bold uppercase rounded hover:bg-sky-800 hover:cursor-pointer transition-colors"
                />
            </form>
            <nav className="lg:flex lg:justify-between">
                <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">Have an account? Log in</Link>
                <Link to="/register" className="block text-center my-5 text-slate-500 uppercase text-sm">Don't have an account? Sign up</Link>
            </nav>
        </>
    )
}

export default ForgotPassword
