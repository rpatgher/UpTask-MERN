import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import clientAxios from "../config/clientAxios";
import Alert from "../components/Alert";

const Confirm = () => {
  const [alert, setAlert] = useState({});
  const [confirmed, setConfirmed] = useState(false);

  const { id: token } = useParams();

  useEffect(() => {
    const confirmUser = async () => {
      try {
        const { data } = await clientAxios(`/users/confirm/${token}`);
        setAlert({
          error: false,
          msg: data.msg
        });
        setConfirmed(true);
      } catch (error) {
        setAlert({
          error: true,
          msg: error.response.data.msg
      });
      }
    };
    return () => confirmUser();
  }, []);
  return (
      <>
          <h1 className="text-sky-600 font-black text-6xl capitalize">Confirm your account and manage your <span className="text-slate-700">projects</span></h1>
          <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
            {alert.msg && <Alert alert={alert} />}

            {confirmed && (
              <Link to="/" className="block text-center my-5 text-slate-500 uppercase text-sm">Log in</Link>
            )}
          </div>
      </>
  )
}

export default Confirm
