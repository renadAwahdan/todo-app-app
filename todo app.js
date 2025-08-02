const taskForm = document.getElementById('taskform');
const taskList = document.getElementById('tasklist');
const searchInput = document.getElementById('searchInput');

let tasks = [];

taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const taskId = document.getElementById('taskId').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;
    const imageInput = document.getElementById('images');

    let imageUrl = '';

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imageUrl = e.target.result;

            if (taskId) {
                updateTask(taskId, title, description, priority, status, imageUrl);
            } else {

                const newTask = {
                    id: Date.now().toString(),
                    title,
                    description,
                    priority,
                    status,
                    image: imageUrl
                };
                tasks.push(newTask);
            }
            resetForm();
            renderTasks();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        if (taskId) {
            updateTask(taskId, title, description, priority, status, null);
        } else {
            const newTask = {
                id: Date.now().toString(),
                title,
                description,
                priority,
                status,
                image: ''
            };
            tasks.push(newTask);
        }
        resetForm();
        renderTasks();
    }
});
function updateTask(id, title, description, priority, status, newImage) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.title = title;
        task.description = description;
        task.priority = priority;
        task.status = status;
        if (newImage !== null) {
            task.image = newImage;
        }
    }
}
function resetForm() {
    taskForm.reset();
    document.getElementById('taskId').value = '';
}

function renderTasks(filteredTasks = tasks) {
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        taskDiv.innerHTML = `
            <h3>${task.title}</h3>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Status:</strong> ${task.status}</p>
            ${task.image ? `<img src="${task.image}" alt="Task Image">` : ''}
            <button class="edit" onclick="editTask('${task.id}')">Edit</button>
            <button class="delete" onclick="deleteTask('${task.id}')">Delete</button>
        `;

        taskList.appendChild(taskDiv);
    });
}
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        document.getElementById('taskId').value = task.id;
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description;
        document.getElementById('priority').value = task.priority;
        document.getElementById('status').value = task.status;
    }
}
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}
searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();
    const filtered = tasks.filter(task => task.title.toLowerCase().includes(query));
    renderTasks(filtered);
});
