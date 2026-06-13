let habits = JSON.parse(localStorage.getItem("habits")) || [];
function save() {
    localStorage.setItem("habits", JSON.stringify(habits));
}
function today() {
    return new Date().toISOString().split("T")[0];
}
function addHabit() {
    let input = document.getElementById("habitInput");
    if (!input.value.trim()) return;
    habits.push({
        id: Date.now(),
        name: input.value,
        dates: []
    });
    input.value = "";
    update();
}
function deleteHabit(id) {
    habits = habits.filter(h => h.id !== id);
    update();
}
function editHabit(id) {
    let habit = habits.find(h => h.id === id);
    let name = prompt("Edit habit:", habit.name);
    if (name && name.trim()) {
        habit.name = name;
        update();
    }
}
function toggleComplete(id) {
    let habit = habits.find(h => h.id === id);
    let date = today();
    if (habit.dates.includes(date)) {
        habit.dates =
            habit.dates.filter(d => d !== date);
    } else {
        habit.dates.push(date);
    }
    update();
}
function calculateStreak(dates) {
    let streak = 0;
    let current = new Date();
    while (true) {
        let check =
            current.toISOString().split("T")[0];
        if (dates.includes(check)) {
            streak++;
            current.setDate(
                current.getDate() - 1
            );
        } else {
            break;
        }
    }
    return streak;
}
function createCalendar(dates) {
    let html = "";
    for (let i = 29; i >= 0; i--) {
        let day = new Date();
        day.setDate(day.getDate() - i);
        let key =
            day.toISOString().split("T")[0];
        let done =
            dates.includes(key)
            ? "done"
            : "";
        html += `
            <div 
                class="day ${done}" 
                title="${key}">
            </div>
        `;
    }
    return html;
}
function render() {
    let list =
        document.getElementById("habitList");
    list.innerHTML = "";
    habits.forEach(habit => {
        let card =
            document.createElement("div");
        card.className = "habit";
        card.innerHTML = `
        <div class="habit-header">
            <h3>${habit.name}</h3>
            <div class="actions">
                <button 
                class="complete"
                onclick="toggleComplete(${habit.id})">
                ✓
                </button>
                <button 
                class="edit"
                onclick="editHabit(${habit.id})">
                ✎
                </button>
                <button 
                class="delete"
                onclick="deleteHabit(${habit.id})">
                🗑
                </button>
            </div>
        </div>
        <div class="streak">
            🔥 Streak:
            ${calculateStreak(habit.dates)} days
        </div>
        <div class="calendar">
            ${createCalendar(habit.dates)}
        </div>
        `;
        list.appendChild(card);
    });
    save();
}
function update() {
    render();
}
render();