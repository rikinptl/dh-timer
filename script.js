// Optometry-themed messages for pop-ups
const focusMessages = [
    { icon: "👓", title: "Focus Session Complete!", message: "You're seeing clearly through your studies! Keep up the amazing work!" },
    { icon: "🔬", title: "Great Focus!", message: "Your vision for success is 20/20! Time for a well-deserved break!" },
    { icon: "💪", title: "Study Power!", message: "You've mastered another session! Your optometry knowledge is getting sharper!" },
    { icon: "⭐", title: "Excellent Work!", message: "You're focusing like a pro! Your future patients will thank you!" },
    { icon: "🎯", title: "Session Complete!", message: "You've hit the mark! Keep your eyes on the prize!" }
];

const breakMessages = [
    { icon: "☕", title: "Break Time!", message: "Time to rest your eyes! Remember the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds!" },
    { icon: "🧘", title: "Relax & Recharge", message: "Take a moment to relax. Your brain needs breaks to process all that optometry knowledge!" },
    { icon: "💧", title: "Hydration Break!", message: "Stay hydrated! Your eyes (and brain) need water to function at their best!" },
    { icon: "🌿", title: "Nature Break", message: "Step outside if you can! Natural light is great for your circadian rhythm!" },
    { icon: "🎵", title: "Music Break", message: "Put on some relaxing music and give your mind a rest. You've earned it!" }
];

const todoMessages = [
    { icon: "✅", title: "Task Complete!", message: "Another item checked off! You're making great progress!" },
    { icon: "🎉", title: "All Done!", message: "You've completed all your tasks! Time to celebrate your productivity!" },
    { icon: "📚", title: "Keep Going!", message: "You're building great study habits! Keep it up!" }
];

// Timer State
let focusTimer = {
    totalSeconds: 25 * 60,
    currentSeconds: 25 * 60,
    interval: null,
    isRunning: false,
    circle: null,
    circumference: 2 * Math.PI * 90
};

let breakTimer = {
    totalSeconds: 5 * 60,
    currentSeconds: 5 * 60,
    interval: null,
    isRunning: false,
    circle: null,
    circumference: 2 * Math.PI * 90
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTimers();
    initializeTodos();
    setupPresetButtons();
});

function initializeTimers() {
    // Focus timer
    focusTimer.circle = document.querySelector('.focus-timer .progress-ring-circle');
    focusTimer.circle.style.strokeDasharray = focusTimer.circumference;
    focusTimer.circle.style.strokeDashoffset = 0;
    
    // Break timer
    breakTimer.circle = document.querySelector('.break-timer .progress-ring-circle');
    breakTimer.circle.style.strokeDasharray = breakTimer.circumference;
    breakTimer.circle.style.strokeDashoffset = 0;
    
    // Focus timer controls
    document.getElementById('focus-start').addEventListener('click', () => startFocusTimer());
    document.getElementById('focus-pause').addEventListener('click', () => pauseFocusTimer());
    document.getElementById('focus-reset').addEventListener('click', () => resetFocusTimer());
    
    // Break timer controls
    document.getElementById('break-start').addEventListener('click', () => startBreakTimer());
    document.getElementById('break-pause').addEventListener('click', () => pauseBreakTimer());
    document.getElementById('break-reset').addEventListener('click', () => resetBreakTimer());
    
    updateFocusDisplay();
    updateBreakDisplay();
}

function setupPresetButtons() {
    // Focus presets
    document.querySelectorAll('.focus-timer .preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes);
            setFocusTime(minutes);
        });
    });
    
    // Break presets
    document.querySelectorAll('.break-timer .preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes);
            setBreakTime(minutes);
        });
    });
}

function setFocusTime(minutes) {
    if (focusTimer.isRunning) return;
    focusTimer.totalSeconds = minutes * 60;
    focusTimer.currentSeconds = minutes * 60;
    updateFocusDisplay();
    resetFocusProgress();
}

function setBreakTime(minutes) {
    if (breakTimer.isRunning) return;
    breakTimer.totalSeconds = minutes * 60;
    breakTimer.currentSeconds = minutes * 60;
    updateBreakDisplay();
    resetBreakProgress();
}

function startFocusTimer() {
    if (focusTimer.isRunning) return;
    
    focusTimer.isRunning = true;
    document.getElementById('focus-start').disabled = true;
    document.getElementById('focus-pause').disabled = false;
    
    focusTimer.interval = setInterval(() => {
        focusTimer.currentSeconds--;
        updateFocusDisplay();
        updateFocusProgress();
        
        if (focusTimer.currentSeconds <= 0) {
            completeFocusSession();
        }
    }, 1000);
}

function pauseFocusTimer() {
    focusTimer.isRunning = false;
    clearInterval(focusTimer.interval);
    document.getElementById('focus-start').disabled = false;
    document.getElementById('focus-pause').disabled = true;
}

function resetFocusTimer() {
    pauseFocusTimer();
    focusTimer.currentSeconds = focusTimer.totalSeconds;
    updateFocusDisplay();
    resetFocusProgress();
}

function startBreakTimer() {
    if (breakTimer.isRunning) return;
    
    breakTimer.isRunning = true;
    document.getElementById('break-start').disabled = true;
    document.getElementById('break-pause').disabled = false;
    
    breakTimer.interval = setInterval(() => {
        breakTimer.currentSeconds--;
        updateBreakDisplay();
        updateBreakProgress();
        
        if (breakTimer.currentSeconds <= 0) {
            completeBreakSession();
        }
    }, 1000);
}

function pauseBreakTimer() {
    breakTimer.isRunning = false;
    clearInterval(breakTimer.interval);
    document.getElementById('break-start').disabled = false;
    document.getElementById('break-pause').disabled = true;
}

function resetBreakTimer() {
    pauseBreakTimer();
    breakTimer.currentSeconds = breakTimer.totalSeconds;
    updateBreakDisplay();
    resetBreakProgress();
}

function updateFocusDisplay() {
    const minutes = Math.floor(focusTimer.currentSeconds / 60);
    const seconds = focusTimer.currentSeconds % 60;
    document.getElementById('focus-time').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateBreakDisplay() {
    const minutes = Math.floor(breakTimer.currentSeconds / 60);
    const seconds = breakTimer.currentSeconds % 60;
    document.getElementById('break-time').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateFocusProgress() {
    const progress = (focusTimer.totalSeconds - focusTimer.currentSeconds) / focusTimer.totalSeconds;
    const offset = focusTimer.circumference - (progress * focusTimer.circumference);
    focusTimer.circle.style.strokeDashoffset = offset;
}

function updateBreakProgress() {
    const progress = (breakTimer.totalSeconds - breakTimer.currentSeconds) / breakTimer.totalSeconds;
    const offset = breakTimer.circumference - (progress * breakTimer.circumference);
    breakTimer.circle.style.strokeDashoffset = offset;
}

function resetFocusProgress() {
    focusTimer.circle.style.strokeDashoffset = focusTimer.circumference;
}

function resetBreakProgress() {
    breakTimer.circle.style.strokeDashoffset = breakTimer.circumference;
}

function completeFocusSession() {
    pauseFocusTimer();
    const message = focusMessages[Math.floor(Math.random() * focusMessages.length)];
    showPopup(message.icon, message.title, message.message);
    showToast("🎉 Focus session complete! Time for a break!");
    
    // Play notification sound if available
    playNotificationSound();
}

function completeBreakSession() {
    pauseBreakTimer();
    const message = breakMessages[Math.floor(Math.random() * breakMessages.length)];
    showPopup(message.icon, message.title, message.message);
    showToast("☕ Break time's up! Ready to focus again?");
    
    playNotificationSound();
}

function playNotificationSound() {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Pop-up Functions
function showPopup(icon, title, message) {
    document.getElementById('popup-icon').textContent = icon;
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-message').textContent = message;
    document.getElementById('popup-modal').classList.add('show');
}

function closePopup() {
    document.getElementById('popup-modal').classList.remove('show');
}

document.getElementById('close-popup').addEventListener('click', closePopup);
document.getElementById('popup-modal').addEventListener('click', (e) => {
    if (e.target.id === 'popup-modal') {
        closePopup();
    }
});

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// To-Do List Functions
let todos = JSON.parse(localStorage.getItem('dhruvi-todos')) || [];
let todoIdCounter = parseInt(localStorage.getItem('dhruvi-todo-id')) || 0;

function initializeTodos() {
    document.getElementById('add-todo').addEventListener('click', addTodo);
    document.getElementById('todo-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    renderTodos();
    updateTodoStats();
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    
    if (text === '') {
        showToast("📝 Please enter a task!");
        return;
    }
    
    todos.push({
        id: todoIdCounter++,
        text: text,
        completed: false
    });
    
    localStorage.setItem('dhruvi-todos', JSON.stringify(todos));
    localStorage.setItem('dhruvi-todo-id', todoIdCounter.toString());
    
    input.value = '';
    renderTodos();
    updateTodoStats();
    
    showToast("✅ Task added!");
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('dhruvi-todos', JSON.stringify(todos));
        renderTodos();
        updateTodoStats();
        
        if (todo.completed) {
            const completedTodos = todos.filter(t => t.completed).length;
            const totalTodos = todos.length;
            
            if (completedTodos === totalTodos && totalTodos > 0) {
                const message = todoMessages[1];
                showPopup(message.icon, message.title, message.message);
            } else {
                showToast("✅ Task completed!");
            }
        }
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    localStorage.setItem('dhruvi-todos', JSON.stringify(todos));
    renderTodos();
    updateTodoStats();
    showToast("🗑️ Task deleted!");
}

function renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<li style="text-align: center; color: var(--text-light); padding: 20px;">No tasks yet. Add one to get started! 👓</li>';
        return;
    }
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));
        
        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = todo.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        
        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);
        
        todoList.appendChild(li);
    });
}

function updateTodoStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    
    document.getElementById('todo-count').textContent = `${total} task${total !== 1 ? 's' : ''}`;
    document.getElementById('completed-count').textContent = `${completed} completed`;
}

