import { useNavigate } from "react-router-dom";
import RegisterForm from ".";

const RegisterFormNavigate = props => {
    const navigate = useNavigate();
    return <RegisterForm {...props} navigate={navigate} />;
}

export default RegisterFormNavigate;