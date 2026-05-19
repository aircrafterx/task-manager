import { Component } from "react";

class TaskItem extends Component{
    onClickDelete = () => {
        const {deleteTask, id} = this.props
        deleteTask(id);
    }

    onClickEdit = () => {
        const {startEdit, id, title, description, priority, status, duedate} = this.props
        startEdit({id, title, description, priority, status, due_date: duedate})
    }

    render(){
        const { title, description, priority, status, duedate } = this.props
        const dueDateStyle =
            status === "completed"
                ? "bg-green-100 text-green-700"
                : status === "overdue"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700";
        return (
            <li className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between h-full">

                <div className="space-y-2">

                    <h3 className="text-base font-semibold text-gray-800 break-words">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-600 break-words">
                        {description}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 pt-2">

                        <span className="px-2 py-1 bg-gray-100 rounded">
                            {priority}
                        </span>

                        <span className="px-2 py-1 bg-gray-100 rounded">
                            {status}
                        </span>

                        <span className={`px-2 py-1 rounded ${dueDateStyle}`}>
                            {duedate}
                        </span>

                    </div>

                </div>

                <div className="flex gap-2 pt-4">

                    <button
                        onClick={this.onClickEdit}
                        className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        Edit
                    </button>

                    <button
                        onClick={this.onClickDelete}
                        className="flex-1 text-sm px-3 py-1.5 border border-red-300 text-red-600 rounded hover:bg-red-50"
                    >
                        Delete
                    </button>

                </div>

            </li>
        )
    }
};

export default TaskItem;