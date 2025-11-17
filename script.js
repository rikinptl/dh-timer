// ==================== CONFIGURATION ====================
const CONFIG = {
    soundEnabled: JSON.parse(localStorage.getItem('dhruvi-sound') ?? 'true'),
    theme: localStorage.getItem('dhruvi-theme') || 'light',
    particlesEnabled: true
};

// ==================== MESSAGES ====================
const focusMessages = [
    { icon: "👓", title: "Focus Session Complete!", message: "You're seeing clearly through your studies! Keep up the amazing work!" },
    { icon: "🔬", title: "Great Focus!", message: "Your vision for success is 20/20! Time for a well-deserved break!" },
    { icon: "💪", title: "Study Power!", message: "You've mastered another session! Your optometry knowledge is getting sharper!" },
    { icon: "⭐", title: "Excellent Work!", message: "You're focusing like a pro! Your future patients will thank you!" },
    { icon: "🎯", title: "Session Complete!", message: "You've hit the mark! Keep your eyes on the prize!" },
    { icon: "🏆", title: "Amazing!", message: "You're building incredible study habits! Your dedication is inspiring!" }
];

const breakMessages = [
    { icon: "☕", title: "Break Time!", message: "Time to rest your eyes! Remember the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds!" },
    { icon: "🧘", title: "Relax & Recharge", message: "Take a moment to relax. Your brain needs breaks to process all that optometry knowledge!" },
    { icon: "💧", title: "Hydration Break!", message: "Stay hydrated! Your eyes (and brain) need water to function at their best!" },
    { icon: "🌿", title: "Nature Break", message: "Step outside if you can! Natural light is great for your circadian rhythm!" },
    { icon: "🎵", title: "Music Break", message: "Put on some relaxing music and give your mind a rest. You've earned it!" },
    { icon: "👀", title: "Eye Care Break", message: "Blink frequently and look away from your screen. Your future self will thank you!" }
];

const todoMessages = [
    { icon: "✅", title: "Task Complete!", message: "Another item checked off! You're making great progress!" },
    { icon: "🎉", title: "All Done!", message: "You've completed all your tasks! Time to celebrate your productivity!" },
    { icon: "📚", title: "Keep Going!", message: "You're building great study habits! Keep it up!" }
];

const celebrationMessages = [
    "You stayed focused and completed your session! The cats are proud of you! 👓✨",
    "Incredible focus! You've earned this celebration! Your dedication is inspiring! 🎯🌟",
    "Outstanding work! You maintained your concentration like a true optometry student! 👓💪",
    "Amazing discipline! The cats are celebrating your achievement with you! 🎉✨",
    "You did it! Your focus was 20/20! Keep up this incredible momentum! 👓🔥",
    "Fantastic session! You're building habits that will make you an amazing optometrist! 🌟👓",
    "Kudos to you! Your commitment to studying is truly admirable! The cats approve! 🎉👓"
];

// ==================== TIMER STATE ====================
let focusTimer = {
    totalSeconds: 25 * 60,
    currentSeconds: 25 * 60,
    interval: null,
    isRunning: false,
    circle: null,
    circumference: 2 * Math.PI * 70
};

let breakTimer = {
    totalSeconds: 5 * 60,
    currentSeconds: 5 * 60,
    interval: null,
    isRunning: false,
    circle: null,
    circumference: 2 * Math.PI * 70
};

// ==================== STATISTICS ====================
let statistics = JSON.parse(localStorage.getItem('dhruvi-stats')) || {
    totalSessions: 0,
    totalStudyTime: 0, // in minutes
    tasksCompleted: 0,
    lastSessionDate: null,
    currentStreak: 0,
    longestStreak: 0
};

// ==================== TODO STATE ====================
let todos = JSON.parse(localStorage.getItem('dhruvi-todos')) || [];
let todoIdCounter = parseInt(localStorage.getItem('dhruvi-todo-id')) || 0;
let currentFilter = 'all';

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeTimers();
    initializeTodos();
    setupPresetButtons();
    setupControls();
    setupKeyboardShortcuts();
    initializeParticles();
    updateStatistics();
    updateSoundIcon();
    
    // Pre-setup chroma key for cat videos (before they're shown)
    setupCatVideoChromaKey('cat-video-1', 'cat-canvas-1');
    setupCatVideoChromaKey('cat-video-2', 'cat-canvas-2');
    setupCatVideoChromaKey('cat-video-3', 'cat-canvas-3');
    setupCatVideoChromaKey('cat-video-4', 'cat-canvas-4');
    setupCatVideoChromaKey('cat-video-5', 'cat-canvas-5');
});

// ==================== THEME MANAGEMENT ====================
function initializeTheme() {
    if (CONFIG.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-icon').textContent = '☀️';
    }
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        document.querySelector('.theme-icon').textContent = '🌙';
        CONFIG.theme = 'light';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-icon').textContent = '☀️';
        CONFIG.theme = 'dark';
    }
    localStorage.setItem('dhruvi-theme', CONFIG.theme);
}

// ==================== SOUND MANAGEMENT ====================
function toggleSound() {
    CONFIG.soundEnabled = !CONFIG.soundEnabled;
    localStorage.setItem('dhruvi-sound', CONFIG.soundEnabled.toString());
    updateSoundIcon();
    showToast(CONFIG.soundEnabled ? '🔊 Sound enabled' : '🔇 Sound disabled');
}

function updateSoundIcon() {
    document.querySelector('.sound-icon').textContent = CONFIG.soundEnabled ? '🔊' : '🔇';
}

// ==================== TIMER FUNCTIONS ====================
function initializeTimers() {
    // Focus timer
    focusTimer.circle = document.querySelector('.focus-timer .progress-ring-circle');
    focusTimer.circle.style.strokeDasharray = focusTimer.circumference;
    focusTimer.circle.style.strokeDashoffset = focusTimer.circumference;
    
    // Break timer
    breakTimer.circle = document.querySelector('.break-timer .progress-ring-circle');
    breakTimer.circle.style.strokeDasharray = breakTimer.circumference;
    breakTimer.circle.style.strokeDashoffset = breakTimer.circumference;
    
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
            // Update active state
            document.querySelectorAll('.focus-timer .preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Clear custom input
            document.getElementById('custom-focus-time').value = '';
        });
    });
    
    // Break presets
    document.querySelectorAll('.break-timer .preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes);
            setBreakTime(minutes);
            // Update active state
            document.querySelectorAll('.break-timer .preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Custom focus timer
    const customFocusInput = document.getElementById('custom-focus-time');
    const setCustomFocusBtn = document.getElementById('set-custom-focus');
    
    setCustomFocusBtn.addEventListener('click', () => {
        const minutes = parseInt(customFocusInput.value);
        if (minutes && minutes > 0 && minutes <= 999) {
            setFocusTime(minutes);
            // Clear active state from preset buttons
            document.querySelectorAll('.focus-timer .preset-btn').forEach(b => b.classList.remove('active'));
            showToast(`⏱️ Custom timer set to ${minutes} minutes!`);
        } else {
            showToast('⚠️ Please enter a valid number between 1 and 999 minutes');
            customFocusInput.focus();
        }
    });
    
    // Allow Enter key to set custom time
    customFocusInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            setCustomFocusBtn.click();
        }
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
    document.getElementById('focus-status').textContent = 'Running';
    document.getElementById('focus-status').classList.add('running');
    
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
    document.getElementById('focus-status').textContent = 'Paused';
    document.getElementById('focus-status').classList.remove('running');
}

function resetFocusTimer() {
    pauseFocusTimer();
    focusTimer.currentSeconds = focusTimer.totalSeconds;
    updateFocusDisplay();
    resetFocusProgress();
    document.getElementById('focus-status').textContent = 'Ready';
    document.getElementById('focus-status').classList.remove('running');
}

function startBreakTimer() {
    if (breakTimer.isRunning) return;
    
    breakTimer.isRunning = true;
    document.getElementById('break-start').disabled = true;
    document.getElementById('break-pause').disabled = false;
    document.getElementById('break-status').textContent = 'Running';
    document.getElementById('break-status').classList.add('running');
    
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
    document.getElementById('break-status').textContent = 'Paused';
    document.getElementById('break-status').classList.remove('running');
}

function resetBreakTimer() {
    pauseBreakTimer();
    breakTimer.currentSeconds = breakTimer.totalSeconds;
    updateBreakDisplay();
    resetBreakProgress();
    document.getElementById('break-status').textContent = 'Ready';
    document.getElementById('break-status').classList.remove('running');
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
    
    // Update statistics
    statistics.totalSessions++;
    statistics.totalStudyTime += Math.floor(focusTimer.totalSeconds / 60);
    updateStreak();
    saveStatistics();
    updateStatistics();
    
    // Show cat celebration
    showCatCelebration();
    
    // Also show regular popup after a delay
    setTimeout(() => {
        const message = focusMessages[Math.floor(Math.random() * focusMessages.length)];
        showPopup(message.icon, message.title, message.message);
    }, 2000);
    
    showToast("🎉 Focus session complete! Time for a break!");
    triggerConfetti();
    
    if (CONFIG.soundEnabled) {
        playNotificationSound('success');
    }
}

function completeBreakSession() {
    pauseBreakTimer();
    const message = breakMessages[Math.floor(Math.random() * breakMessages.length)];
    showPopup(message.icon, message.title, message.message);
    showToast("☕ Break time's up! Ready to focus again?");
    
    if (CONFIG.soundEnabled) {
        playNotificationSound('break');
    }
}

// ==================== SOUND FUNCTIONS ====================
function playNotificationSound(type = 'success') {
    if (!CONFIG.soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'success') {
            // Success sound - ascending notes
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } else {
            // Break sound - gentle chime
            oscillator.frequency.value = 440;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.8);
        }
    } catch (e) {
        console.log('Audio context not available');
    }
}

// ==================== POPUP & TOAST ====================
function showPopup(icon, title, message) {
    document.getElementById('popup-icon').textContent = icon;
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-message').textContent = message;
    document.getElementById('popup-modal').classList.add('show');
}

function closePopup() {
    document.getElementById('popup-modal').classList.remove('show');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== STATISTICS ====================
function updateStreak() {
    const today = new Date().toDateString();
    const lastDate = statistics.lastSessionDate ? new Date(statistics.lastSessionDate).toDateString() : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastDate === today) {
        // Already counted today
        return;
    } else if (lastDate === yesterdayStr || lastDate === null) {
        // Continue or start streak
        statistics.currentStreak++;
        if (statistics.currentStreak > statistics.longestStreak) {
            statistics.longestStreak = statistics.currentStreak;
        }
    } else {
        // Streak broken
        statistics.currentStreak = 1;
    }
    
    statistics.lastSessionDate = today;
}

function updateStatistics() {
    document.getElementById('streak-count').textContent = statistics.currentStreak;
    document.getElementById('total-sessions').textContent = statistics.totalSessions;
    
    const hours = Math.floor(statistics.totalStudyTime / 60);
    const minutes = statistics.totalStudyTime % 60;
    if (hours > 0) {
        document.getElementById('total-time').textContent = `${hours}h ${minutes}m`;
    } else {
        document.getElementById('total-time').textContent = `${minutes}m`;
    }
    
    document.getElementById('tasks-completed').textContent = statistics.tasksCompleted;
}

function saveStatistics() {
    localStorage.setItem('dhruvi-stats', JSON.stringify(statistics));
}

function resetStatistics() {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
        statistics = {
            totalSessions: 0,
            totalStudyTime: 0,
            tasksCompleted: 0,
            lastSessionDate: null,
            currentStreak: 0,
            longestStreak: 0
        };
        saveStatistics();
        updateStatistics();
        showToast('📊 Statistics reset!');
    }
}

// ==================== TODO LIST ====================
function initializeTodos() {
    document.getElementById('add-todo').addEventListener('click', addTodo);
    document.getElementById('todo-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTodos();
        });
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
        completed: false,
        createdAt: new Date().toISOString()
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
        if (todo.completed) {
            statistics.tasksCompleted++;
            saveStatistics();
            updateStatistics();
        }
        localStorage.setItem('dhruvi-todos', JSON.stringify(todos));
        renderTodos();
        updateTodoStats();
        
        if (todo.completed) {
            const completedTodos = todos.filter(t => t.completed).length;
            const totalTodos = todos.length;
            
            if (completedTodos === totalTodos && totalTodos > 0) {
                const message = todoMessages[1];
                showPopup(message.icon, message.title, message.message);
                triggerConfetti();
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
    
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }
    
    if (filteredTodos.length === 0) {
        const emptyMsg = currentFilter === 'all' ? 'No tasks yet. Add one to get started! 👓' :
                        currentFilter === 'active' ? 'No active tasks! 🎉' :
                        'No completed tasks yet.';
        todoList.innerHTML = `<li style="text-align: center; color: var(--text-light); padding: 20px;">${emptyMsg}</li>`;
        return;
    }
    
    filteredTodos.forEach(todo => {
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
    
    document.getElementById('todo-count').textContent = total;
    document.getElementById('completed-count').textContent = completed;
}

// ==================== CONTROLS SETUP ====================
function setupControls() {
    // Dark mode toggle
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleTheme);
    
    // Sound toggle
    document.getElementById('sound-toggle').addEventListener('click', toggleSound);
    
    // Statistics toggle
    document.getElementById('stats-toggle').addEventListener('click', () => {
        const panel = document.getElementById('stats-panel');
        panel.classList.toggle('show');
        updateStatistics();
    });
    
    document.getElementById('close-stats').addEventListener('click', () => {
        document.getElementById('stats-panel').classList.remove('show');
    });
    
    // Reset stats
    document.getElementById('reset-stats').addEventListener('click', resetStatistics);
    
    // Popup close
    document.getElementById('close-popup').addEventListener('click', closePopup);
    document.getElementById('popup-modal').addEventListener('click', (e) => {
        if (e.target.id === 'popup-modal') {
            closePopup();
        }
    });
    
    // Shortcuts modal
    document.getElementById('close-shortcuts').addEventListener('click', () => {
        document.getElementById('shortcuts-modal').classList.remove('show');
    });
    
    // Cat celebration close
    document.getElementById('close-celebration').addEventListener('click', closeCatCelebration);
    
    // Allow clicking outside celebration to close (optional)
    document.getElementById('cat-celebration').addEventListener('click', (e) => {
        if (e.target.id === 'cat-celebration') {
            closeCatCelebration();
        }
    });
}

// ==================== KEYBOARD SHORTCUTS ====================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in input
        if (e.target.tagName === 'INPUT' && e.key !== 'Enter') return;
        
        switch(e.key) {
            case ' ':
                e.preventDefault();
                if (focusTimer.isRunning) {
                    pauseFocusTimer();
                } else {
                    startFocusTimer();
                }
                break;
            case '1':
                e.preventDefault();
                setFocusTime(25);
                document.querySelectorAll('.focus-timer .preset-btn')[0].classList.add('active');
                break;
            case '2':
                e.preventDefault();
                setFocusTime(45);
                document.querySelectorAll('.focus-timer .preset-btn')[1].classList.add('active');
                break;
            case '3':
                e.preventDefault();
                setFocusTime(60);
                document.querySelectorAll('.focus-timer .preset-btn')[2].classList.add('active');
                break;
            case '4':
                e.preventDefault();
                setBreakTime(5);
                document.querySelectorAll('.break-timer .preset-btn')[0].classList.add('active');
                break;
            case '5':
                e.preventDefault();
                setBreakTime(10);
                document.querySelectorAll('.break-timer .preset-btn')[1].classList.add('active');
                break;
            case '6':
                e.preventDefault();
                setBreakTime(15);
                document.querySelectorAll('.break-timer .preset-btn')[2].classList.add('active');
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                if (focusTimer.isRunning) resetFocusTimer();
                else if (breakTimer.isRunning) resetBreakTimer();
                break;
            case 'd':
            case 'D':
                e.preventDefault();
                toggleTheme();
                break;
            case 's':
            case 'S':
                e.preventDefault();
                toggleSound();
                break;
            case 't':
            case 'T':
                e.preventDefault();
                document.getElementById('stats-panel').classList.toggle('show');
                updateStatistics();
                break;
            case '?':
                e.preventDefault();
                document.getElementById('shortcuts-modal').classList.toggle('show');
                break;
            case 'Escape':
                document.getElementById('popup-modal').classList.remove('show');
                document.getElementById('shortcuts-modal').classList.remove('show');
                document.getElementById('stats-panel').classList.remove('show');
                break;
        }
    });
}

// ==================== PARTICLE ANIMATION ====================
function initializeParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==================== CONFETTI ANIMATION ====================
function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    
    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 10 + 5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedY = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }
    
    for (let i = 0; i < 100; i++) {
        confetti.push(new ConfettiPiece());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((piece, index) => {
            piece.update();
            piece.draw();
            
            if (piece.y > canvas.height) {
                confetti.splice(index, 1);
            }
        });
        
        if (confetti.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
}

// ==================== CAT CELEBRATION ====================
// Chroma key color (#00fb28)
const CHROMA_KEY_COLOR = { r: 0, g: 251, b: 40 };
const CHROMA_KEY_THRESHOLD = 50; // Adjust for better edge detection

function applyChromaKey(video, canvas) {
    const ctx = canvas.getContext('2d');
    const width = video.videoWidth || 300;
    const height = video.videoHeight || 300;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, width, height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate distance from chroma key color
        const dr = Math.abs(r - CHROMA_KEY_COLOR.r);
        const dg = Math.abs(g - CHROMA_KEY_COLOR.g);
        const db = Math.abs(b - CHROMA_KEY_COLOR.b);
        const distance = Math.sqrt(dr * dr + dg * dg + db * db);
        
        // If pixel is close to chroma key color, make it transparent
        if (distance < CHROMA_KEY_THRESHOLD) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
    }
    
    // Put processed image data back
    ctx.putImageData(imageData, 0, 0);
}

function setupCatVideoChromaKey(videoId, canvasId) {
    const video = document.getElementById(videoId);
    const canvas = document.getElementById(canvasId);
    
    if (!video || !canvas) return;
    
    // Wait for video metadata
    video.addEventListener('loadedmetadata', () => {
        const width = video.videoWidth || 300;
        const height = video.videoHeight || 300;
        canvas.width = width;
        canvas.height = height;
        
        // Start processing frames
        function processFrame() {
            if (!video.paused && !video.ended) {
                applyChromaKey(video, canvas);
                requestAnimationFrame(processFrame);
            }
        }
        
        video.addEventListener('play', () => {
            processFrame();
        });
        
        // Process first frame if already playing
        if (!video.paused) {
            processFrame();
        }
    });
}

function showCatCelebration() {
    const celebration = document.getElementById('cat-celebration');
    const videos = [
        document.getElementById('cat-video-1'),
        document.getElementById('cat-video-2'),
        document.getElementById('cat-video-3'),
        document.getElementById('cat-video-4'),
        document.getElementById('cat-video-5')
    ];
    
    // Select random celebration message
    const message = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
    document.getElementById('celebration-message-text').textContent = message;
    
    // Show celebration overlay
    celebration.classList.add('show');
    
    // Setup chroma key for each video
    setupCatVideoChromaKey('cat-video-1', 'cat-canvas-1');
    setupCatVideoChromaKey('cat-video-2', 'cat-canvas-2');
    setupCatVideoChromaKey('cat-video-3', 'cat-canvas-3');
    setupCatVideoChromaKey('cat-video-4', 'cat-canvas-4');
    setupCatVideoChromaKey('cat-video-5', 'cat-canvas-5');
    
    // Play all videos with audio
    videos.forEach((video, index) => {
        video.currentTime = 0; // Reset to start
        video.muted = false; // Unmute to play audio
        video.volume = 0.6; // Set volume
        
        video.play().catch(e => {
            console.log('Video autoplay prevented, user interaction required');
            // If autoplay fails, we'll handle it when user clicks
        });
        
        // Stagger the start times slightly for more natural effect
        setTimeout(() => {
            if (video.paused) {
                video.play().catch(e => console.log('Video play error:', e));
            }
        }, index * 200);
    });
    
    // Ensure at least one video plays audio (browser autoplay restrictions)
    if (videos.length > 0) {
        videos[0].muted = false;
        videos[0].volume = 0.7; // Set volume
    }
}

function closeCatCelebration() {
    const celebration = document.getElementById('cat-celebration');
    const videos = [
        document.getElementById('cat-video-1'),
        document.getElementById('cat-video-2'),
        document.getElementById('cat-video-3'),
        document.getElementById('cat-video-4'),
        document.getElementById('cat-video-5')
    ];
    
    // Pause all videos
    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
        video.muted = true; // Mute when closing
    });
    
    celebration.classList.remove('show');
}
