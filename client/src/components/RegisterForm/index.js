import { Component } from "react";
import Cookies from 'js-cookie'
import {toast} from "react-hot-toast"

class RegisterForm extends Component{
    state={
        email:"", 
        password: "", 
        confirmPassword: "", 
        errMsg: "", 
        showSuccessModal: false, 
        loading: false, 
        showResend: false, 
        resendCoolDown: 0, 
        pendingVerificationEmail: "",
        resendLoading: false,
        modalType: ""
    }

    componentWillUnmount(){
        if(this.coolDownTime){
            clearInterval(this.coolDownTime);
        }
    }

    startResendCooldown = () => {
        if(this.coolDownTime){
            clearInterval(this.coolDownTime);
        }

        this.setState({resendCoolDown: 60});

        this.coolDownTime = setInterval(() => {
            this.setState(prev => {
                if (prev.resendCoolDown <= 1) {
                    clearInterval(this.coolDownTime);
                    return { resendCoolDown: 0 };
                }
                return {resendCoolDown: prev.resendCoolDown - 1};
            });
        }, 1000);
    }

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
                    window.location.href = "/task-manager/auth";
                }, 2000);
                return;
            }

            if (response.status === 403) {
                toast.error("Unauthorized access");
                return;
            }

            if(data.code === "VERIFICATION_PENDING"){
                toast.error("Verification pending");
                this.startResendCooldown();
                this.setState({
                    errMsg: "verification pending, you can resend the email.", 
                    showResend: true,
                    showSuccessModal: true,
                    pendingVerificationEmail: email,
                    modalType: "pending",

                    email: "",
                    password: "",
                    confirmPassword: "",
                });
                return;
            }

            if (response.ok) {
                this.startResendCooldown();

                this.setState({
                    showSuccessModal: true,
                    errMsg: "",
                    pendingVerificationEmail: email,
                    email: "",
                    password: "",
                    confirmPassword: "",
                    showResend: true,
                    modalType: "success",
                });
                toast.success("Verification email sent.");
            } else {
                this.setState({ errMsg: data.message, showResend: false });
            }
        }catch(err){
            toast.error("Network error. Please try again");
        }finally{
            this.setState({loading: false});
        }
    }

    handleResend = async event => {
        event.preventDefault();
        
        const {pendingVerificationEmail} = this.state;
        const url = `${process.env.REACT_APP_API_URL}/api/auth/resend-verification`;

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({email: pendingVerificationEmail}),
        };

        try{
            if(this.state.resendLoading) return;
            this.setState({resendLoading: true});
            const response = await fetch(url, options);
            const data = await response.json();
            if(response.ok){
                this.startResendCooldown();

                toast.success("Verification email resent.");
                this.setState({errMsg: ''});
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error("Network error.");
        }finally{
            this.setState({resendLoading: false})
        }
    }

    render() {
        const {errMsg, showSuccessModal} = this.state;
        return (
            <div>
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                        <div className="relative bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6 text-center animate-fadeIn">
                            <button
                                type="button"
                                onClick={() => {
                                    if(this.coolDownTime){
                                        clearInterval(this.coolDownTime);
                                    }
                                    this.setState({
                                        showSuccessModal: false,
                                        modalType: "",
                                        showResend: false,
                                        resendCoolDown: 0,
                                    });
                                }}
                                className="
                                    absolute
                                    top-4
                                    right-4
                                    text-gray-400
                                    hover:text-gray-700
                                    transition
                                "
                            >
                                ✕
                            </button>
                            <div className={`
                                w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
                                ${this.state.modalType === "success"
                                    ? "bg-green-100"
                                    : "bg-yellow-100"}
                                `}
                            >
                                <span className="text-3xl">
                                    {this.state.modalType === "success" ? "✓" : "!"}
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {
                                    this.state.modalType === "success"
                                        ? "Registration Successful"
                                        : "Email Verification Pending"
                                }
                            </h2>

                            <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                {
                                    this.state.modalType === "success"
                                        ? "Please check your email inbox and verify your account before logging in."
                                        : "Your account is already registered, but email verification is still pending."
                                }
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



                                {this.state.showResend && (
                                    <button
                                        type="button"
                                        disabled={
                                            this.state.resendCoolDown > 0 || 
                                            this.state.resendLoading
                                        }
                                        onClick={this.handleResend}
                                        className="
                                            flex-1
                                            border
                                            border-gray-300
                                            py-2
                                            rounded-lg
                                            text-sm
                                            font-medium
                                            hover:bg-gray-100
                                            transition
                                            disabled:bg-gray-100
                                            disabled:text-gray-400
                                            disabled:cursor-not-allowed
                                        "
                                    >
                                        {
                                            this.state.resendLoading 
                                                ? "Sending..." 
                                                : this.state.resendCoolDown > 0
                                                    ? `Resend in ${this.state.resendCoolDown}`
                                                    : "Resend verification email"


                                        }
                                    </button>
                                )}
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