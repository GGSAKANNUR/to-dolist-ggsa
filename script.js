function addReminder() {
    const task = document.getElementById('taskInput').value;
    const dateStr = document.getElementById('dateInput').value;
    const list = document.getElementById('reminderList');

    if (!task || !dateStr) {
        alert("Please fill in both fields!");
        return;
    }

    const li = document.createElement('li');
    li.setAttribute('data-date', dateStr); // Store date for sorting
    let completionDate = null;

    li.innerHTML = `
        <div class="task-info">
            <strong>${task}</strong>
            <span class="task-date">Due: ${dateStr}</span>
        </div>
        <div class="action-area">
            <button class="tick-btn">Tick</button>
            <span class="done-mark">Done ✔</span>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    const tickBtn = li.querySelector('.tick-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    
    tickBtn.onclick = function() {
        if (confirm("Mark as completed? This cannot be undone.")) {
            li.classList.add('completed');
            tickBtn.classList.add('hidden');
            completionDate = new Date();
        }
    };

    deleteBtn.onclick = function() {
        const now = new Date();
        const daysPast = Math.floor((now - completionDate) / (1000 * 60 * 60 * 24));
        if (daysPast >= 30) {
            if (confirm("Delete permanently?")) li.remove();
        } else {
            alert(`Wait 30 days after completion. (${30 - daysPast} days left)`);
        }
    };

    list.appendChild(li);
    sortList(); // Run sort after adding

    document.getElementById('taskInput').value = '';
    document.getElementById('dateInput').value = '';
}

function sortList() {
    const list = document.getElementById('reminderList');
    const items = Array.from(list.children);

    items.sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-date'));
        const dateB = new Date(b.getAttribute('data-date'));
        return dateA - dateB; // Ascending order
    });

    items.forEach(item => list.appendChild(item));
}
