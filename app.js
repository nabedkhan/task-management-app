// module pattern design
// ==================================

// function to do the storage related task
const storageControllers = (function () {
    return {
        addToStorage(task) {
            let tasks;
            if (localStorage.getItem('tasks') === null) {
                tasks = [];
            } else {
                tasks = JSON.parse(localStorage.getItem('tasks'));
            }
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        },
        getTasksFromStorage() {
            let tasks;
            if (localStorage.getItem('tasks') === null) {
                tasks = [];
            } else {
                tasks = JSON.parse(localStorage.getItem('tasks'));
            }
            return tasks;
        },
        updateTasksFromStorage(updateTask) {
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks.forEach((task, index) => {
                if (task.id === updateTask.id) {
                    tasks.splice(index, 1, updateTask);
                }
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        },
        deleteTasksFromStorage(deleteTask) {
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks.forEach((task, index) => {
                if (task.id === deleteTask.id) {
                    tasks.splice(index, 1);
                }
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        },
        completedTaskFromStorage(completedTask) {
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks.forEach((task, index) => {
                if (task.id === completedTask.id) {
                    tasks.splice(index, 1, completedTask);
                }
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
})();

// function to handle the data related task
const tasksControllers = (function (storageControllers) {
    let data = {
        tasks: storageControllers.getTasksFromStorage(),
        currentTask: null,
    };
    return {
        getTasks() {
            return data.tasks
        },
        addTask(task) {
            const id = data.tasks.length > 0 ? data.tasks.length : 0;
            const newTask = {
                id,
                name: task,
                completed: false
            };
            const updateData = {
                ...data,
                tasks: [...data.tasks, newTask]
            };
            data = updateData;
            return newTask;
        },
        deleteTask(currentTask) {
            const taskAfterDeletion = data.tasks.filter(task => task.id !== currentTask.id);
            data.tasks = taskAfterDeletion;
        },
        getTasksById(id) {
            return data.tasks.find(task => task.id === id);
        },
        setCurrentTask(editedTask) {
            data.currentTask = editedTask;
        },
        getCurrentTask() {
            return data.currentTask;
        },
        updateItem(taskTitle) {
            let foundTask = null;
            data.tasks.map(task => {
                if (task.id === data.currentTask.id) {
                    task.name = taskTitle;
                    foundTask = task;
                    return task;
                } else {
                    return task;
                }
            });
            return foundTask;
        },
        completedTask(id) {
            let completedTask = null;
            data.tasks = data.tasks.map(task => {
                if (task.id === id) {
                    task.completed = !task.completed;
                    completedTask = task;
                    return task;
                } else {
                    return task;
                }
            });
            return completedTask;
        },
        totalTaskCount() {
            return data.tasks.length;
        },
        completedTaskCount() {
            const completedTask = data.tasks.filter(task => task.completed === true);
            return completedTask.length;
        }
    }
})(storageControllers);

// function to handle the ui related task
const uiControllers = (function () {
    const selectors = {
        taskContainer: 'tasks-container',
        addTask: 'add-task',
        updateTask: 'update-task',
        deleteTask: 'delete-task',
        backBtn: 'back-btn',
        title: 'input-text',
        completedTaskNumber: 'complete-task',
        totalTaskNumber: 'total-task'
    }
    return {
        getSelectors: function () {
            return selectors;
        },
        getInputText() {
            return document.getElementById(selectors.title).value;
        },
        clearInputField() {
            document.getElementById(selectors.title).value = ""
        },
        showAlert() {
            console.log('Your input value has been empty');
        },
        showEditState() {
            document.getElementById(selectors.addTask).style.display = "none";
            document.getElementById(selectors.updateTask).style.display = "";
            document.getElementById(selectors.deleteTask).style.display = "";
            document.getElementById(selectors.backBtn).style.display = "";
        },
        clearEditState() {
            document.getElementById(selectors.addTask).style.display = "";
            document.getElementById(selectors.updateTask).style.display = "none";
            document.getElementById(selectors.deleteTask).style.display = "none";
            document.getElementById(selectors.backBtn).style.display = "none";
        },
        formPopulate(taskTitle) {
            document.getElementById(selectors.title).value = taskTitle;
        },
        populateTask(tasks) {
            let htmlMarkup = '';
            tasks.forEach(task => {
                htmlMarkup += `<div class="col-md-6 mt-3">
                    <div class="card card-body flex-row justify-content-between align-items-center" id=task-${task.id}>
                        <h4 class="mb-0 ${task.completed ? 'completed-task' : ''}">${task.name}</h4>
                        <div class="icons">
                            <button class="btn"><i class="far fa-check-circle"></i></button>
                            <button class="btn"><i class="fas fa-edit"></i></button>
                        </div>
                    </div>
                </div>`;
            });
            document.getElementById(selectors.taskContainer).innerHTML = htmlMarkup;
        },
        addNewTaskInUi(task) {
            const htmlMarkup = `<div class="col-md-6 mt-3">
                    <div class="card card-body flex-row justify-content-between align-items-center" id=task-${task.id}>
                        <h4 class="mb-0">${task.name}</h4>
                        <div class="icons">
                            <button class="btn"><i class="far fa-check-circle"></i></button>
                            <button class="btn"><i class="fas fa-edit"></i></button>
                        </div>
                    </div>
                </div>`;
            document.getElementById(selectors.taskContainer).innerHTML += htmlMarkup;
        },
        totalTaskCount(length) {
            document.getElementById(selectors.totalTaskNumber).innerText = length;
        },
        totalCompletedCount(length) {
            document.getElementById(selectors.completedTaskNumber).innerText = length;
        }
    }
})();

// function to handle the connect between different part
const appControllers = (function (tasksControllers, uiControllers, storageControllers) {
    const loadEventListeners = function () {
        const selectors = uiControllers.getSelectors();
        document.getElementById(selectors.addTask).addEventListener('click', addTaskSubmit);
        document.getElementById(selectors.updateTask).addEventListener('click', updateTaskSubmit);
        document.getElementById(selectors.deleteTask).addEventListener('click', deleteTask);
        document.getElementById(selectors.backBtn).addEventListener('click', backBtn);
        document.getElementById(selectors.taskContainer).addEventListener('click', taskComplete);
        document.getElementById(selectors.taskContainer).addEventListener('click', editTask);
    }
    function editTask(e) {
        if (e.target.className === 'fas fa-edit') {
            uiControllers.showEditState();
            const element = e.target.parentElement.parentElement.parentElement;
            const id = Number(element.id.split('-')[1]);
            const updatedTask = tasksControllers.getTasksById(id);
            tasksControllers.setCurrentTask(updatedTask);
            uiControllers.formPopulate(updatedTask.name);
        }
    }
    function taskComplete(e) {
        if (e.target.className === 'far fa-check-circle') {
            const element = e.target.parentElement.parentElement.parentElement;
            const id = Number(element.id.split('-')[1]);
            const completedTask = tasksControllers.completedTask(id);
            const tasks = tasksControllers.getTasks();
            uiControllers.populateTask(tasks);
            const completedTaskCountLength = tasksControllers.completedTaskCount();
            uiControllers.totalCompletedCount(completedTaskCountLength);
            // console.log(completedTask);
            storageControllers.completedTaskFromStorage(completedTask);
        }
    }
    function addTaskSubmit(e) {
        e.preventDefault();
        const inputValue = uiControllers.getInputText();
        if (inputValue.trim() === '') {
            uiControllers.showAlert();
        } else {
            const task = tasksControllers.addTask(inputValue);
            uiControllers.addNewTaskInUi(task);
            uiControllers.clearInputField();
            const totalTaskLength = tasksControllers.totalTaskCount();
            uiControllers.totalTaskCount(totalTaskLength);
            console.log(task);
            storageControllers.addToStorage(task);

        }
    }
    function backBtn() {
        uiControllers.clearEditState();
        uiControllers.clearInputField();
    }
    function updateTaskSubmit(e) {
        e.preventDefault();
        const titleInput = uiControllers.getInputText();
        const updateTask = tasksControllers.updateItem(titleInput);
        uiControllers.clearInputField();
        uiControllers.clearEditState();
        const tasks = tasksControllers.getTasks();
        uiControllers.populateTask(tasks);
        storageControllers.updateTasksFromStorage(updateTask);

    }
    function deleteTask(e) {
        e.preventDefault();

        const currentTask = tasksControllers.getCurrentTask();
        const task = tasksControllers.deleteTask(currentTask);
        const tasks = tasksControllers.getTasks();
        uiControllers.populateTask(tasks);
        uiControllers.clearInputField();
        uiControllers.clearEditState();
        storageControllers.deleteTasksFromStorage(currentTask);

    }
    return {
        init() {
            const totalTaskLength = tasksControllers.totalTaskCount();
            uiControllers.totalTaskCount(totalTaskLength);
            const completedTaskCountLength = tasksControllers.completedTaskCount();
            uiControllers.totalCompletedCount(completedTaskCountLength);
            const tasks = tasksControllers.getTasks();
            uiControllers.populateTask(tasks);
            uiControllers.clearEditState();
            loadEventListeners();
        }
    }

})(tasksControllers, uiControllers, storageControllers);

appControllers.init();