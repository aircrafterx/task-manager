import { Component } from "react";
import Cookies from 'js-cookie'
import LoginForm from '../components/LoginForm/withNavigate';
import RegisterForm from '../components/RegisterForm/withNavigate'

class Auth extends Component{
    state={login:true};

    componentDidMount(){
            const token = Cookies.get("token");
            if(token !== undefined){
                window.location.href = "/task-manager/dashboard";
            }
        }

    onClickLogin = () => {
        this.setState({login: true});
    }

    onClickRegister = () => {
        this.setState({login: false});
    }

    render(){
        const {login} = this.state;
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm p-8">

                    <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                        Task Manager
                    </h1>

                    <div className="flex mb-6 border-b border-gray-200">
                        <button
                            onClick={this.onClickLogin}
                            className={`flex-1 py-2 text-sm font-medium ${login
                                    ? "border-b-2 border-gray-900 text-gray-900"
                                    : "text-gray-500"
                                }`}
                        >
                            Login
                        </button>

                        <button
                            onClick={this.onClickRegister}
                            className={`flex-1 py-2 text-sm font-medium ${!login
                                    ? "border-b-2 border-gray-900 text-gray-900"
                                    : "text-gray-500"
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {login ? <LoginForm /> : <RegisterForm />}

                    <div className="mt-2 pt-4 border-t border-gray-100 text-center text-sm">
                        <span className="text-gray-500">
                            {login ? "New user?" : "Already have an account?"}
                        </span>

                        <button
                            type="button"
                            onClick={login ? this.onClickRegister : this.onClickLogin}
                            className="
                                ml-1
                                text-gray-900
                                font-medium
                                hover:text-gray-700
                                hover:underline
                                transition
                            "
                        >
                            {login ? "Register" : "Login"}
                        </button>
                    </div>

                </div>

            </div>
        )
    }
};

export default Auth;