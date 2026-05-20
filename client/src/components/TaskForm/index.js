import { Component } from "react"
import Cookies from 'js-cookie'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {toast} from 'react-hot-toast'

import './index.css'

class TaskForm extends Component{
    state = { title: "", description: "", priority: "", status: "", dueDate: "", errMsg: '' }

    componentDidUpdate(prevProps){
        const {editingTask} = this.props
        if(editingTask && prevProps.editingTask !== editingTask){
            const task = editingTask;
            this.setState({
                title: task.title, 
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.due_date,
            })
        }
    }

    onChangeTitle = event => {
        this.setState({ title: event.target.value });
    }

    onChangeDesc = event => {
        this.setState({ description: event.target.value });
    }

    onChangePriority = event => {
        this.setState({ priority: event.target.value });
    }

    onChangeStatus = event => {
        this.setState({ status: event.target.value });
    }

    onChangeDue = event => {
        this.setState({ dueDate: event.target.value });
    }

    onSubmitForm = async event => {
        event.preventDefault();
        console.log("task submit triggered");
        const {title, description, priority, status, dueDate} = this.state;
        if(!title){
            this.setState({errMsg: "Please Provide Valid Title!"});
            return;
        }

        if (!priority) {
            this.setState({ errMsg: "Please Select Valid Priority!" });
            return;
        }

        if(!status){
            this.setState({ errMsg: "Please Select Valid Status!" });
            return;
        }

        if(!dueDate){
            this.setState({ errMsg: "Please Provide Valid Due Date!" });
            return;
        }

        const token = Cookies.get("token");

        const {editingTask, stopEdit, refreshList} = this.props;

        let url = `${process.env.REACT_APP_API_URL}/api/tasks`;
        let method = "POST";

        if(editingTask){
            url = `${process.env.REACT_APP_API_URL}/api/tasks/${editingTask.id}`;
            method = "PUT";
        }
        
        const options = {
            method,
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
            },
            body: JSON.stringify({title, description, priority, status, due_date: dueDate}),
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
                if (editingTask) {
                    toast.success("Task updated successfully.")
                } else {
                    toast.success("Task created successfully.")
                }

                this.setState({ title: '', description: '', priority: '', status: '', dueDate: '', errMsg: '' });
                stopEdit && stopEdit();
                refreshList && refreshList();
            } else {
                this.setState({ errMsg: data.message });
            }
        } catch (err) {
            toast.error("Network error. Please try again");
        }
    }

    render() {
        const {title, description, priority, status, dueDate, errMsg} = this.state;
        const {editingTask} = this.props;
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {editingTask ? "Edit Task" : "Create Task"}
                </h2>

                <form onSubmit={this.onSubmitForm} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={this.onChangeTitle}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={this.onChangeDesc}
                            rows="3"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-gray-900"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                onChange={this.onChangePriority}
                                value={priority}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                                <option value="" disabled hidden>Select Priority</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                onChange={this.onChangeStatus}
                                value={status}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                                <option value="" disabled hidden>Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                        </label>

                        <DatePicker
                            selected={dueDate ? new Date(dueDate) : null}
                            onChange={(date) =>
                                this.setState({
                                    dueDate: date.toISOString().split("T")[0]
                                })
                            }
                            minDate={new Date()}
                            dateFormat="yyyy-MM-dd"
                            portalId="root"
                            popperPlacement="bottom-start"
                            wrapperClassName="w-full"
                            calendarClassName="react-datepicker-custom"
                            className="
                                w-full
                                border
                                border-gray-300
                                rounded-md
                                px-3
                                py-2
                                text-sm
                                bg-white
                                focus:outline-none
                                focus:ring-2
                                focus:ring-gray-900
                            "
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-medium
        hover:bg-gray-800 transition"
                    >
                        {editingTask ? "Update Task" : "Add Task"}
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

export default TaskForm;