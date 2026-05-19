import { useNavigate } from "react-router-dom";
import LoginForm from ".";

const LoginFormNavigate = props => {
    const navigate = useNavigate();
    return <LoginForm {...props} navigate={navigate} />
};

export default LoginFormNavigate