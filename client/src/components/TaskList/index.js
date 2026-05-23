import { Component } from "react";
import Cookies from 'js-cookie'
import {toast} from 'react-hot-toast'

import TaskItem from "../TaskItem"

class TaskList extends Component{
    deleteTask = async id => {
        const token = Cookies.get("token");
        const url = `${process.env.REACT_APP_API_URL}/api/tasks/${id}`;
        const options = {
            method: "DELETE",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try{
            const response = await fetch(url, options);

            if (response.status === 401) {
                toast.error("Session expired. Please login again");
                Cookies.remove("token");
                setTimeout(() => {
                    window.location.href = "/task-maanger/auth";
                }, 2000);
                return;
            }

            if (response.status === 403) {
                toast.error("Unauthorized access");
                return;
            }

            if (response.ok) {
                const { refreshList } = this.props
                refreshList();
                toast.success("Task deleted.");
            }
        }catch(err){
            toast.error("Network error. Please try again");
        }
    }

    render() {
        const { startEdit, tasksList } = this.props;
        return (
            <div>

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Your Tasks
                </h2>

                {tasksList.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No tasks created yet.
                    </p>
                ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tasksList.map(each => (
                                <TaskItem
                                    key={each.id}
                                    id={each.id}
                                    title={each.title}
                                    description={each.description}
                                    priority={each.priority}
                                    status={each.status}
                                    duedate={each.dueDate}
                                    deleteTask={this.deleteTask}
                                    startEdit={startEdit}
                                />
                            ))}
                        </ul>
                )}

            </div>
        )
    }
};

export default TaskList;