import { Component } from "react";
import Cookies from 'js-cookie'
import {toast} from 'react-hot-toast'

class LoginForm extends Component{
    state={email: "", password: "", errMsg: "", loading: false};

    componentDidMount(){
        const token = Cookies.get("token");
        if(token !== undefined){
            window.location.href = "/task-manager/dashboard";
        }

        const params = new URLSearchParams(window.location.search);
        const verification = params.get("verification");

        if(verification === "success") toast.success("Email Verified Successfully, Please login!");

        if(verification === "invalid") toast.error("Invalid or expired verification link");

        if(verification === "error") toast.error("Verification failed. Please try again.");

        window.history.replaceState({}, document.title, "/task-manager/auth");
    }

    onChangeEmail = event => {
        this.setState({email: event.target.value, errMsg: ''});
    }

    onChangePassword = event => {
        this.setState({password: event.target.value, errMsg: ''});
    }

    onSubmitForm = async event => {
        event.preventDefault();
        if(this.state.loading) return;
        this.setState({loading: true})
        const {email, password} = this.state;
        const url = `${process.env.REACT_APP_API_URL}/api/auth/login`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password}),
        };
        
        try{
            const response = await fetch(url, options);
            const data = await response.json();

            if (response.status === 401) {
                toast.error("Session expired. Please login again");
                Cookies.remove("token");
                setTimeout(() => {
                    window.location.href = "/task-manager/auth";
                }, 2000);
                return;
            }

            if (response.status === 403) {
                toast.error("Unauthorized access");
                return;
            }

            if (response.ok) {
                Cookies.set("token", data.jwtToken, {
                    expires: 1 / 24,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    path: '/',
                });

                const { navigate } = this.props;
                navigate("/task-manager/dashboard", { replace: true });
                toast.success("Welcome back!");
            } else {
                this.setState({ errMsg: data.message });
            }
            this.setState({ email: "", password: "" });
        }catch(err){
            toast.error("Network error. Please try again");
        }finally{
            this.setState({loading: false});
        }
    }

    render(){
        const {errMsg} = this.state
        return (
            <form onSubmit={this.onSubmitForm} className="space-y-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={this.state.email}
                        onChange={this.onChangeEmail}
                        disabled={this.state.loading}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        disabled={this.state.loading}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />
                </div>

                <button
                    type="submit"
                    disabled={this.state.loading}
                    className="
                        w-full
                        bg-gray-900
                        text-white
                        py-2
                        rounded-md
                        mb-4
                        text-sm
                        font-medium
                        hover:bg-gray-800
                        transition
                        disabled:bg-gray-500
                        disabled:text-gray-200
                        disabled:cursor-not-allowed
                    "
                >
                    {this.state.loading ? "Signing In..." : "Sign In"}
                </button>

                {errMsg && (
                    <p className="text-sm text-red-500 text-center">
                        {errMsg}
                    </p>
                )}

            </form>
        )
    }
};

export default LoginForm;