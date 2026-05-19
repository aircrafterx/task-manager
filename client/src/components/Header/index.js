import { Component } from "react";
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode'
import {toast} from 'react-hot-toast';

import ChangePassword from '../ChangePassword'
import DeleteAccount from "../DeleteAccount";

class Header extends Component{
    state={isOpen: false, changePassword: false, deleteAccount: false, name: 'User'}

    componentDidMount(){
        const token = Cookies.get("token");
        try {
            if (token) {
                const decoded = jwtDecode(token);
                this.setState({ name: decoded.email.split('@')[0]})
            }
        } catch (err) {
            Cookies.remove("token");
            window.location.href = "/auth";
        }
    }

    onClickChangePassword = () => {
        this.setState(prev => ({changePassword: !prev.changePassword}))
    }

    onClickDelete = () => {
        this.setState(prev => ({deleteAccount: !prev.deleteAccount}))
    }

    onClickCancelForChange = () => {
        this.setState({changePassword: false});
    }

    onClickCancelForDelete = () => {
        this.setState({deleteAccount: false});
    }

    onClickLogout = () => {
        Cookies.remove("token");
        window.location.href = "/auth";
        toast.success("Logged out successfully.");
    }

    onClickToggle = () => {
        this.setState(prev => ({isOpen: !prev.isOpen}))
    }

    render(){
        const {isOpen, changePassword, deleteAccount, name} = this.state;
        return (
            <>
                <nav className="bg-white border-b border-gray-200">

                    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

                        <h1 className="text-lg font-semibold text-gray-800">
                            Task Manager
                        </h1>

                        <div className="relative flex items-center gap-3">

                            <p className="text-sm text-gray-600">
                                {name}
                            </p>

                            <button
                                onClick={this.onClickToggle}
                                className="text-sm font-medium bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition"
                            >
                                Profile
                            </button>

                            {isOpen && (
                                <ul className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-md shadow-md py-1">

                                    <li>
                                        <button
                                            onClick={this.onClickChangePassword}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Change Password
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            onClick={this.onClickDelete}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Delete Account
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            type="button"
                                            onClick={this.onClickLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </li>

                                </ul>
                            )}

                        </div>

                    </div>

                </nav>

                {changePassword && <ChangePassword onClickCancelForChange={this.onClickCancelForChange} />}
                {deleteAccount && <DeleteAccount onClickCancelForDelete={this.onClickCancelForDelete} />}
            </>
        )
    }
}

export default Header;