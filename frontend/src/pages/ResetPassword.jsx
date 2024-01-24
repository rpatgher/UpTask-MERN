import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import clientAxios from "../config/clientAxios";
import Alert from "../components/Alert";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [alert, setAlert] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [modifiedPassword, setModifiedPassword] = useState(false);


    const { token } = useParams();

    useEffect(() => {
        const validateToken = async () => {
            try {
                await clientAxios.get(`/users/forgot-password/${token}`)
                setAlert({});
                setShowForm(true);
            } catch (error) {
                setAlert({
                    error: true,
                    msg: error.response.data.msg
                });
                setShowForm(false);
            }
        }
        validateToken();
    } , []);

    const handleSubmit = async e => {
        e.preventDefault();
        if (password === '' || password2 === ''){
            setAlert({
                error: true,
                msg: 'All fields are required'
              });
            return;
        }
        if (password !== password2){
            setAlert({
                error: true,
                msg: 'Passwords do not match'
              });
            return;
        }
        if (password < 6){
            setAlert({
                error: true,
                msg: 'Password must be at least 6 characters long'
              });
            return;
        }
        setAlert({});
        try {
            const {data} = await clientAxios.post(`/users/forgot-password/${token}`, { password });
            setAlert({
                error: false,
                msg: data.msg
            });
            setPassword('');
            setPassword2('');
            setModifiedPassword(true);
        } catch (error) {
            setAlert({
                error: true,
                msg: error.response.data.msg
            });
        }
        setShowForm(false);
    }


    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">Reset your password and manage your <span className="text-slate-700">projects</span></h1>
            {alert.msg && <Alert alert={alert} />}

            {showForm && (
                <form 
                    className="my-10 bg-white shadow rounded-lg p-10"
                    onSubmit={handleSubmit}
                >
                    <div className="my-5">
                        <label htmlFor="password" className="text-gray-600 uppercase block font-bold text-xl">New Password</label>
                        <input 
                            type="password" 
                            id="password"
                            placeholder="Your new password"
                            className="w-full mt-3 p-3 boder rounded-xl bg-gray-50"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>
                    <div className="my-5">
                        <label htmlFor="password2" className="text-gray-600 uppercase block font-bold text-xl">Confirm Password</label>
                        <input 
                            type="password" 
                            id="password2"
                            placeholder="Confirm your password"
                            className="w-full mt-3 p-3 boder rounded-xl bg-gray-50"
                            onChange={e => setPassword2(e.target.value)}
                            value={password2}
                        />
                    </div>
                    <input 
                        type="submit" 
                        value="Save new Password" 
                        className="bg-sky-700 w-full py-3 mb-5 text-white font-bold uppercase rounded hover:bg-sky-800 hover:cursor-pointer transition-colors"
                    />
                </form>
            )}
            {modifiedPassword && (
              <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">Log in</Link>
            )}
        </>
    )
}

export default ResetPassword
