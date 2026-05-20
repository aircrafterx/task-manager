import { Component } from "react";
import Cookies from 'js-cookie'
import {toast} from 'react-hot-toast'

class DeleteAccount extends Component{
    state={password : '', errMsg: ''}

    onChangePassword = event => {
        this.setState({password: event.target.value})
    }

    onSubmitForm = async event => {
        event.preventDefault()
        const {password} = this.state
        const token = Cookies.get('token')

        if(!password){
            this.setState({errMsg: "Enter Valid Password"})
            return;
        }

        const url = `${process.env.REACT_APP_API_URL}/api/user`;
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({password}),
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
                toast.success("Account deactivated successfully.");
                Cookies.remove('token');
                setTimeout(() => {
                    window.location.href = '/auth';
                }, 2000);
            } else {
                this.setState({ errMsg: data.message })
            }
        }catch(err){
            toast.error("Network error. Please try again");
        }
    }

    render(){
        const {password, errMsg} = this.state;
        const { onClickCancelForDelete } = this.props;
        return (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

                <div className="bg-white w-full max-w-sm rounded-lg border border-gray-200 shadow-lg p-6">

                    <h2 className="text-lg font-semibold text-red-600 mb-2">
                        Deactivate Account
                    </h2>

                    <p className="text-sm text-gray-600 mb-1">
                        Are you sure you want to deactivate your account?
                    </p>

                    <p className="text-sm text-gray-600 mb-4">
                        Type your password to confirm.
                    </p>

                    <form onSubmit={this.onSubmitForm} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={this.onChangePassword}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">

                            <button
                                type="button"
                                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                                onClick={onClickCancelForDelete}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete Account
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

export default DeleteAccount