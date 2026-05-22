import { Component } from "react";
import Cookies from 'js-cookie'
import {toast} from "react-hot-toast"

class RegisterForm extends Component{
    state={email:"", password: "", confirmPassword: "", errMsg: "", showSuccessModal: false, loading: false}

    onChangeEmail = event => {
        this.setState({ email: event.target.value, errMsg: '' });
    }

    onChangePassword = event => {
        this.setState({ password: event.target.value, errMsg: '' });
    }

    onChangeConfirmPassword = event => {
        this.setState({confirmPassword: event.target.value, errMsg: ''});
    }

    onSubmitForm = async event => {
        event.preventDefault();

        if(this.state.loading) return;

        this.setState({loading: true});

        const {email, password, confirmPassword} = this.state;

        if(password !== confirmPassword){
            this.setState({errMsg: 'password is not matched to confirm password', loading: false});
            return;
        }
        
        const url = `${process.env.REACT_APP_API_URL}/api/auth/register`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        }

        try{
            const response = await fetch(url, options);
            const data = await response.json();

            if (response.status === 401) {
                toast.error("Session expired. Please login again");
                Cookies.remove("token");
                setTimeout(() => {
                    window.location.href = "/auth";
                }, 2000);
                return;
            }

            if (response.status === 403) {
                toast.error("Unauthorized access");
                return;
            }

            if (response.ok) {
                this.setState({
                    showSuccessModal: true,
                    errMsg: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
                toast.success("Verification email sent.")
            } else {
                this.setState({ errMsg: data.message });
            }
            this.setState({ email: "", password: "", confirmPassword: "" });
        }catch(err){
            toast.error("Network error. Please try again");
        }finally{
            this.setState({loading: false});
        }
    }

    render() {
        const {errMsg, showSuccessModal} = this.state;
        return (
            <div>
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                        <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6 text-center animate-fadeIn">

                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">✓</span>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Registration Successful
                            </h2>

                            <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                Please check your email inbox and verify your account before logging in.
                            </p>

                            <div className="flex gap-3">

                                <button
                                    onClick={() => {
                                        window.open(
                                            "https://mail.google.com",
                                            "_blank"
                                        );
                                    }}
                                    className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                                >
                                    Open Gmail
                                </button>

                                <button
                                    onClick={() => {
                                        this.setState({
                                            showSuccessModal: false
                                        });
                                    }}
                                    className="flex-1 border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>
                )}

                <form onSubmit={this.onSubmitForm} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={this.state.email}
                            disabled={this.state.loading}
                            onChange={this.onChangeEmail}
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
                            disabled={this.state.loading}
                            onChange={this.onChangePassword}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={this.state.confirmPassword}
                            onChange={this.onChangeConfirmPassword}
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
                            text-sm
                            font-medium
                            hover:bg-gray-800
                            transition
                            disabled:bg-gray-500
                            disabled:text-gray-200
                            disabled:cursor-not-allowed
                        "
                    >
                        {
                            this.state.loading
                                ? "Creating Account..."
                                : "Create Account"
                        }
                    </button>

                    {errMsg && (
                        <p className="text-sm text-red-500 text-center">
                            {errMsg}
                        </p>
                    )}

                </form>
            </div>
        )
    }
};

export default RegisterForm;