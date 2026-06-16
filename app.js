const { createApp } = Vue;

createApp({
    data() {
        return {
            tasks: [],
            newTask: '',
            isFocusing: false,
            currentSession: 0,
            totalSecondsToday: 0,
            timerInterval: null,
            score: 0,
            streak: 0,
            completedTasks: 0,
            totalTasks: 0
        }
    },
    methods: {
        // ==================== TASK METHODS ====================
        
        addTask() {
            if (!this.newTask.trim()) return;
            
            fetch('http://127.0.0.1:5000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: this.newTask
                })
            })
            .then(response => response.json())
            .then(data => {
                this.tasks.push({
                    id: data.task.id,
                    title: data.task.title,
                    completed: data.task.completed,
                    editing: false
                });
                this.newTask = '';
                this.updateStats();
            })
            .catch(error => console.error('Error:', error));
        },

        deleteTask(id) {
            fetch(`http://127.0.0.1:5000/tasks/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                this.tasks = this.tasks.filter(task => task.id !== id);
                this.updateStats();
            })
            .catch(error => console.error('Error:', error));
        },

        toggleTask(id, completed) {
            fetch(`http://127.0.0.1:5000/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: completed
                })
            })
            .then(response => response.json())
            .then(data => {
                this.updateStats();
            })
            .catch(error => console.error('Error:', error));
        },

        toggleEdit(task) {
            task.editing = !task.editing;
            if (task.editing) {
                this.$nextTick(() => {
                    // Focus will happen automatically with autofocus
                });
            }
        },

        saveEdit(id) {
            const task = this.tasks.find(t => t.id === id);
            if (!task) return;

            fetch(`http://127.0.0.1:5000/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: task.title
                })
            })
            .then(response => response.json())
            .then(data => {
                task.editing = false;
            })
            .catch(error => console.error('Error:', error));
        },

        // ==================== FOCUS METHODS ====================

        startFocus() {
            fetch('http://127.0.0.1:5000/focus/start', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                this.isFocusing = true;
                this.startTimer();
            })
            .catch(error => console.error('Error:', error));
        },

        stopFocus() {
            fetch('http://127.0.0.1:5000/focus/stop', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                this.isFocusing = false;
                this.currentSession = 0;
                this.stopTimer();
                this.updateStats();
            })
            .catch(error => console.error('Error:', error));
        },

        startTimer() {
            if (this.timerInterval) return;
            
            this.timerInterval = setInterval(() => {
                this.updateFocusStatus();
            }, 1000);
        },

        stopTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        },

        updateFocusStatus() {
            fetch('http://127.0.0.1:5000/focus/status')
                .then(response => response.json())
                .then(data => {
                    this.isFocusing = data.is_focusing;
                    this.currentSession = data.current_session;
                    this.totalSecondsToday = data.total_seconds_today;
                })
                .catch(error => console.error('Error:', error));
        },

        // ==================== STATS METHODS ====================

        updateStats() {
            fetch('http://127.0.0.1:5000/stats/summary')
                .then(response => response.json())
                .then(data => {
                    this.score = data.score;
                    this.streak = data.streak;
                    this.totalSecondsToday = data.total_seconds_today;
                    this.completedTasks = data.completed_tasks;
                    this.totalTasks = data.total_tasks;
                })
                .catch(error => console.error('Error:', error));
        },

        // ==================== UTILITY METHODS ====================

        formatTime(seconds) {
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    },
    mounted() {
        // Load tasks
        fetch('http://127.0.0.1:5000/tasks')
            .then(response => response.json())
            .then(data => {
                this.tasks = data.tasks.map(task => ({
                    ...task,
                    editing: false
                }));
            })
            .catch(error => console.error('Error:', error));

        // Load focus status
        this.updateFocusStatus();

        // Load stats
        this.updateStats();

        // Start polling
        this.startTimer();
    }
}).mount('#app');