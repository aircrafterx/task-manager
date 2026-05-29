import { Component } from "react";
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'

import Header from '../components/Header'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import TaskFilters from '../components/TaskFilters'


class Dashboard extends Component{
    state = { 
        editingTask: null, 
        tasksList: [], 
        totalTasks: 0, 
        totalPages: 0, 
        currentPage: 1, 
        statusFilter: '', 
        priorityFilter: '', 
        sortBy: '', 
        sortOrder: '' 
    }
    
    componentDidMount(){
        this.getTaskList();
    }

    getTaskList = async () => {
        const {statusFilter, priorityFilter, sortBy, sortOrder, currentPage} = this.state;
        const allowedStatus = ['pending', 'completed', 'overdue'];
        const allowedPriority = ['low', 'high', 'medium'];
        const allowedSort = ['due_date', 'title'];
        const allowedSortOrder = ['asc', 'desc'];

        const token = Cookies.get("token");
        let url = `${process.env.REACT_APP_API_URL}/api/tasks`;

        let queryParams = [`page=${currentPage}`];
        if (allowedStatus.includes(statusFilter)) {
            queryParams.push(`status=${statusFilter}`);
        }

        if (allowedPriority.includes(priorityFilter)) {
            queryParams.push(`priority=${priorityFilter}`);
        }

        if(allowedSort.includes(sortBy)){
            queryParams.push(`sortBy=${sortBy}`);
            if (allowedSortOrder.includes(sortOrder)) queryParams.push(`sortOrder=${sortOrder}`);
            else queryParams.push('sortOrder=asc');
        }

        if (queryParams.length > 0) {
            url += `?${queryParams.join("&")}`;
        }

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if (response.status === 401) {
            Cookies.remove("token");
            toast.error("Session expired. Please login again.");
            window.location.href = "/task-manager/auth";
        }

        if (response.ok) {
            const formattedRows = data.tasks.map(each => ({
                id: each.id,
                title: each.title,
                description: each.description,
                priority: each.priority,
                status: each.status,
                dueDate: each.due_date ? each.due_date.split("T")[0] : "",

            }))
            this.setState({ 
                tasksList: formattedRows, 
                totalTasks: data.totalTasks, 
                totalPages: data.totalPages, 
                currentPage: data.currentPage 
            });
            console.log(data)
        } else {
            console.log(data.message);
        }
    }

    onChangeStatus = status => {
        this.setState({statusFilter: status}, this.getTaskList);
    }

    onChangePriority = priority => {
        this.setState({priorityFilter: priority}, this.getTaskList);
    }

    onChangeSortBy = sortBy => {
        this.setState({sortBy: sortBy}, this.getTaskList);
    }

    onChangeSortOrder = sortOrder => {
        this.setState({sortOrder: sortOrder}, this.getTaskList);
    }

    startEdit = task => {
        this.setState({editingTask: task})
    }

    stopEdit = () => {
        this.setState({editingTask: null})
    }

    authorizeToken = () =>{
        const token = Cookies.get("token")
        if(token === undefined){
            window.location.href = "/task-manager/auth"
        }
    }

    render(){
        const {editingTask, tasksList, statusFilter, priorityFilter, currentPage, totalPages, totalTasks} = this.state
        return (
            <div className="min-h-screen bg-gray-50">

                <Header />

                <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">

                    <TaskForm
                        editingTask={editingTask}
                        startEdit={this.startEdit}
                        stopEdit={this.stopEdit}
                        refreshList={this.getTaskList}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-1">
                            <TaskFilters 
                                onChangePriority={this.onChangePriority} 
                                onChangeStatus={this.onChangeStatus}
                                onChangeSortBy={this.onChangeSortBy}
                                onChangeSortOrder={this.onChangeSortOrder}
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <TaskList 
                                startEdit={this.startEdit} 
                                tasksList={tasksList} 
                                refreshList={this.getTaskList} 
                                statusFilter={statusFilter}
                                priorityFilter={priorityFilter}
                                totalTasks={totalTasks}                                   
                            />

                            <div className="mt-6 flex items-center justify-center gap-2">

                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() => {
                                        this.setState(
                                            prev => ({ currentPage: prev.currentPage - 1 }),
                                            this.getTaskList
                                        );
                                    }}
                                    className="
                                        px-3 py-1.5
                                        text-sm
                                        border border-gray-300
                                        rounded-md
                                        bg-white
                                        hover:bg-gray-100
                                        disabled:opacity-40
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    Prev
                                </button>

                                <div className="flex items-center gap-1">

                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;

                                        return (
                                            <button
                                                key={pageNumber}
                                                type="button"
                                                onClick={() => {
                                                    this.setState(
                                                        { currentPage: pageNumber },
                                                        this.getTaskList
                                                    );
                                                }}
                                                className={`
                                                    w-9 h-9
                                                    text-sm
                                                    rounded-md
                                                    border
                                                    transition
                                                    ${currentPage === pageNumber
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                                    }
                    `}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}

                                </div>

                                <button
                                    type="button"
                                    disabled={currentPage === totalPages}
                                    onClick={() => {
                                        this.setState(
                                            prev => ({ currentPage: prev.currentPage + 1 }),
                                            this.getTaskList
                                        );
                                    }}
                                    className="
                                        px-3 py-1.5
                                        text-sm
                                        border border-gray-300
                                        rounded-md
                                        bg-white
                                        hover:bg-gray-100
                                        disabled:opacity-40
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    Next
                                </button>

                            </div>
                        </div>

                    </div>


                </main>

            </div>
        )
    }
};

export default Dashboard;