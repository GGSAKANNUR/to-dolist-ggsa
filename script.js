// 1. Load existing reminders from LocalStorage on page load
let reminders = JSON.parse(localStorage.getItem('myReminders')) || [];

// Initial render
window.onload = renderReminders;

function addReminder() {
    const task = document.getElementById('taskInput').value;
    const dateStr = document.getElementById('dateInput').value;

    if (!task || !dateStr) {
        alert("Please fill in both fields!");
        return;
    }

    // 2. Add new reminder object to the array
    const newReminder = {
        id: Date.now(), // unique ID for tracking
        task: task,
        dueDate: dateStr,
        completed: false,
        completionTime: null
    };

    reminders.push(newReminder);
    saveAndRender();
    
    document.getElementById('taskInput').value = '';
    document.getElementById('dateInput').value = '';
}

function toggleComplete(id) {
    if (confirm("Mark as completed? This cannot be undone.")) {
        const reminder = reminders.find(r => r.id === id);
        if (reminder) {
            reminder.completed = true;
            reminder.completionTime = new Date().getTime(); // store timestamp
            saveAndRender();
        }
    }
}

function deleteReminder(id) {
    const reminder = reminders.find(r => r.id === id);
    const now = new Date().getTime();
    
    // Check if 30 days (in milliseconds) have passed since completion
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const timeElapsed = now - (reminder.completionTime || 0);

    if (reminder.completed && timeElapsed >= thirtyDaysInMs) {
        if (confirm("Delete permanently?")) {
            reminders = reminders.filter(r => r.id !== id);
            saveAndRender();
        }
    } else {
        const daysLeft = Math.ceil((thirtyDaysInMs - timeElapsed) / (1000 * 60 * 60 * 24));
        alert(`Cannot delete yet. Wait ${daysLeft} more days.`);
    }
}

// 3. Helper to save to LocalStorage and refresh the UI
function saveAndRender() {
    localStorage.setItem('myReminders', JSON.stringify(reminders));
    renderReminders();
}

function renderReminders() {
    const list = document.getElementById('reminderList');
    list.innerHTML = '';

    reminders.forEach(reminder => {
        const li = document.createElement('li');
        if (reminder.completed) li.classList.add('completed');

        li.innerHTML = `
            <div class="task-info">
                <strong>${reminder.task}</strong>
                <span class="task-date">Due: ${reminder.dueDate}</span>
            </div>
            <div class="action-area">
                <button class="tick-btn ${reminder.completed ? 'hidden' : ''}" 
                        onclick="toggleComplete(${reminder.id})">Tick</button>
                <span class="done-mark" style="display: ${reminder.completed ? 'inline' : 'none'}">Done ✔</span>
                <button class="delete-btn" style="display: ${reminder.completed ? 'inline' : 'none'}" 
                        onclick="deleteReminder(${reminder.id})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}
