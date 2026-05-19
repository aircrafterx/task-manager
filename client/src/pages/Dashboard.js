import { Component } from "react";
import Cookies from 'js-cookie'
import Header from '../components/Header'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'

class Dashboard extends Component{
    state = { editingTask: null, tasksList: [] }
    
    componentDidMount(){
        this.getTaskList();
    }

    getTaskList = async () => {
        const token = Cookies.get("token");
        const url = 'http://localhost:5000/api/tasks';
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
            alert("Session expired. Please login again.");
            window.location.href = "/auth";
        }

        if (response.ok) {
            const formattedRows = data.map(each => ({
                id: each.id,
                title: each.title,
                description: each.description,
                priority: each.priority,
                status: each.status,
                dueDate: each.due_date ? each.due_date.split("T")[0] : "",

            }))
            this.setState({ tasksList: formattedRows });
            console.log(data)
        } else {
            console.log(data.message);
        }
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
            window.location.href = "/auth"
        }
    }

    render(){
        const {editingTask, tasksList} = this.state
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

                    <TaskList startEdit={this.startEdit} tasksList={tasksList} refreshList={this.getTaskList} />

                </main>

            </div>
        )
    }
};

export default Dashboard;