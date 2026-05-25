import { Component } from "react";

class TaskFilters extends Component {

    onChangeStatus = event => {
        const { onChangeStatus } = this.props;
        onChangeStatus(event.target.value);
    }

    onChangePriority = event => {
        const { onChangePriority } = this.props;
        onChangePriority(event.target.value);
    }

    onChangeSortBy = event => {
        const { onChangeSortBy } = this.props;
        onChangeSortBy(event.target.value);
    }

    onChangeSortOrder = event => {
        const { onChangeSortOrder } = this.props;
        onChangeSortOrder(event.target.value);
    }

    render() {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Filters & Sorting
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>

                        <select
                            onChange={this.onChangeStatus}
                            className="
                                w-full
                                border
                                border-gray-300
                                rounded-md
                                px-3
                                py-2
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-gray-900
                            "
                        >
                            <option value="">
                                All Status
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                            <option value="overdue">
                                Overdue
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                        </label>

                        <select
                            onChange={this.onChangePriority}
                            className="
                                w-full
                                border
                                border-gray-300
                                rounded-md
                                px-3
                                py-2
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-gray-900
                            "
                        >
                            <option value="">
                                All Priorities
                            </option>

                            <option value="high">
                                High
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="low">
                                Low
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sort By
                        </label>

                        <select
                            onChange={this.onChangeSortBy}
                            className="
                                w-full
                                border
                                border-gray-300
                                rounded-md
                                px-3
                                py-2
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-gray-900
                            "
                        >
                            <option value="">
                                Default
                            </option>

                            <option value="due_date">
                                Due Date
                            </option>

                            <option value="title">
                                Title
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Order
                        </label>

                        <select
                            onChange={this.onChangeSortOrder}
                            className="
                                w-full
                                border
                                border-gray-300
                                rounded-md
                                px-3
                                py-2
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-gray-900
                            "
                        >
                            <option value="asc">
                                Ascending
                            </option>

                            <option value="desc">
                                Descending
                            </option>
                        </select>
                    </div>

                </div>

            </div>
        )
    }
}

export default TaskFilters;