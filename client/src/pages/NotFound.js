import Cookies from 'js-cookie'
import { useNavigate} from 'react-router-dom'
import NotFoundImg from '../media/not-found.png'

const NotFound = () => {
    const navigate = useNavigate();
    const verify = () => {
        const token = Cookies.get("token");
        if(!token){
            navigate("/auth");
        }else{
            navigate("/dashboard");
        }   
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">

            <img
                src={NotFoundImg}
                alt="not-found"
                className="w-64 h-64 object-contain mb-6"
            />

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Page Not Found
            </h1>

            <p className="text-gray-500 text-center mb-6">
                Sorry, the page you are looking for does not exist.
            </p>

            <button
                onClick={verify}
                className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition"
            >
                Go Back Home
            </button>

        </div>
    );
}

export default NotFound;