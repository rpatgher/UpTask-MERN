import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Sidebar = () => {
    const { auth } = useAuth();
    return (
        <aside className='md:w-1/3 lg:w-1/5 xl:w-1/6 px-5 py-10'>
            <p className="text-xl font-bold">Hello: {auth.name}</p>
            <Link to="create" className='bg-sky-600 w-full font-bold uppercase block text-white p-3 mt-5 text-center rounded-lg'>New Proyect</Link>

        </aside>
    )
}

export default Sidebar
