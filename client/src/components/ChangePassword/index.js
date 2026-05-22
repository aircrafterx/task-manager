import { Component } from "react";
import Cookies from 'js-cookie'
import {toast} from 'react-hot-toast'

class ChangePassword extends Component{
    state={oldPassword: '', newPassword: '', confirmPassword: '', errMsg: '', loading: false}

    onChangeOld = event => {
        this.setState({oldPassword: event.target.value, errMsg: ''})
    }

    onChangeNew = event => {
        this.setState({newPassword: event.target.value, errMsg: ''})
    }

    onChangeConfirm = event => {
        this.setState({confirmPassword: event.target.value, errMsg: ''})
    }

    onSubmitForm = async event => {
        event.preventDefault();
        if(this.state.loading) return;
        this.setState({loading: true});
        const {oldPassword, newPassword, confirmPassword} = this.state
        const token = Cookies.get('token');

        if(newPassword !== confirmPassword){
            this.setState({errMsg: 'new password is not matched to confirm password', loading: false})
            return;
        }

        const url = `${process.env.REACT_APP_API_URL}/api/user`;
        const options = {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({password: oldPassword, newPassword}),
        };

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
                toast.success("Password updated successfully!");
                Cookies.remove('token');
                setTimeout(() => {
                    window.location.href = '/auth';
                }, 2000);
            } else {
                this.setState({ errMsg: data.message })
            }
        }catch(err){
            toast.error("Network error. Please try again");
        }finally{
            this.setState({loading: false});
        }
    }

    render(){
        const {oldPassword, newPassword, confirmPassword, errMsg} = this.state;
        const { onClickCancelForChange } = this.props
        return (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

                <div className="bg-white w-full max-w-sm rounded-lg border border-gray-200 shadow-lg p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Change Password
                    </h2>

                    <form onSubmit={this.onSubmitForm} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Old Password
                            </label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={this.onChangeOld}
                                disabled={this.state.loading}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={this.onChangeNew}
                                disabled={this.state.loading}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={this.onChangeConfirm}
                                disabled={this.state.loading}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">

                            <button
                                type="button"
                                disabled={this.state.loading}
                                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                                onClick={onClickCancelForChange}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={this.state.loading}
                                className="
                                    px-4
                                    py-2
                                    bg-gray-900
                                    text-white
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
                                        ? "Updating Password..."
                                        : "Update Password"
                                }
                            </button>

                        </div>

                        {errMsg && (
                            <p className="text-sm text-red-500 text-center">
                                {errMsg}
                            </p>
                        )}

                    </form>

                </div>

            </div>
        )
    }
}

export default ChangePassword