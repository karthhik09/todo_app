import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/footer';
import TaskList from '../components/tasklist';
import useGreeting from '../hooks/greetings';
import { tasksAPI } from '../services/api';
import { emailService } from '../services/emailservice';
import { LuAlarmClock } from 'react-icons/lu';

function DashboardPage({ darkMode, setDarkMode, onNavigate, sidebarOpen, setSidebarOpen, currentUser }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [addingTask, setAddingTask] = useState(false);

    // Reminder fields
    const [showReminderFields, setShowReminderFields] = useState(false);
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const greeting = useGreeting();

    // Fetch tasks from backend on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const tasksData = await tasksAPI.getTasks(currentUser?.userId);
            // Map backend response to frontend format
            const mappedTasks = tasksData.map(task => ({
                id: task.taskId,
                text: task.title,
                completed: task.status,
                dueDateTime: task.dueDateTime
            }));
            setTasks(mappedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async () => {
        if (newTask.trim()) {
            try {
                setAddingTask(true);
                console.log('Attempting to add task:', newTask.trim());

                // Prepare task data with optional reminder fields
                const taskData = {
                    title: newTask.trim(),
                    status: false,
                    userId: currentUser?.userId
                };

                // Add due date/time if set
                if (dueDate && dueTime) {
                    const dueDateTimeStr = `${dueDate}T${dueTime}`;
                    taskData.dueDateTime = dueDateTimeStr;
                }

                const task = await tasksAPI.addTask(
                    taskData.title,
                    taskData.status,
                    taskData.userId,
                    taskData.dueDateTime
                );
                console.log('Task added successfully:', task);

                // Add new task to the list
                setTasks([
                    ...tasks,
                    { id: task.taskId, text: task.title, completed: task.status, dueDateTime: task.dueDateTime }
                ]);

                // Send email notification if task has a due date/time
                if (dueDate && dueTime && currentUser?.email) {
                    try {
                        const taskDueDate = new Date(`${dueDate}T${dueTime}`);
                        const day = taskDueDate.getDate().toString().padStart(2, '0');
                        const month = taskDueDate.toLocaleString('en-US', { month: 'short' });
                        const year = taskDueDate.getFullYear();
                        const time = taskDueDate.toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        });
                        const formattedDueTime = `${day} ${month} ${year} at ${time}`;

                        await emailService.sendTaskReminderEmail(
                            currentUser.email,
                            currentUser.name || 'User',
                            task.title,
                            formattedDueTime
                        );
                    } catch (emailError) {
                        console.error('Failed to send email notification:', emailError);
                        // Don't fail task creation if email fails
                    }
                }

                // Reset form
                setNewTask('');
                setDueDate('');
                setDueTime('');
                setShowReminderFields(false);
            } catch (error) {
                console.error('Error adding task:', error);
                console.error('Error response:', error.response?.data);
                console.error('Error status:', error.response?.status);
                console.error('Error message:', error.message);
                alert(`Failed to add task. Error: ${error.response?.data?.message || error.message}`);
            } finally {
                setAddingTask(false);
            }
        }
    };

    const toggleTask = async (id) => {
        try {
            await tasksAPI.toggleTask(id);
            // Update local state
            setTasks(
                tasks.map((task) =>
                    task.id === id ? { ...task, completed: !task.completed } : task
                )
            );
        } catch (error) {
            console.error('Error toggling task:', error);
            alert('Failed to update task. Please try again.');
        }
    };

    const deleteTask = async (id) => {
        try {
            await tasksAPI.deleteTask(id);
            // Remove from local state
            setTasks(tasks.filter((task) => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    };

    const updateTask = async (id, newText) => {
        try {
            await tasksAPI.updateTask(id, newText);
            // Update local state
            setTasks(
                tasks.map((task) =>
                    task.id === id ? { ...task, text: newText } : task
                )
            );
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        }
    };

    const getFilteredTasks = () => {
        if (filter === 'active') return tasks.filter((t) => !t.completed);
        if (filter === 'completed') return tasks.filter((t) => t.completed);
        return tasks;
    };

    return (
        <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="flex flex-1">
                <Sidebar
                    darkMode={darkMode}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    currentPage="dashboard"
                    currentUser={currentUser}
                    onNavigate={(page) => {
                        // Only close sidebar on mobile (screen width < 1024px)
                        if (window.innerWidth < 1024) {
                            setSidebarOpen(false);
                        }
                        onNavigate(page);
                    }}
                />

                <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}>
                    <div className={`flex-1 p-4 lg:p-8 transition-all duration-300 ${sidebarOpen ? 'pl-4' : 'pl-24'} lg:pl-8`}>
                        <div className="max-w-5xl mx-auto">
                            <Header
                                darkMode={darkMode}
                                currentUser={currentUser}
                            />

                            <h1
                                className="text-3xl lg:text-4xl font-bold mb-8 lg:mb-12"
                                style={{ color: darkMode ? '#FFFFFF' : '#1F41BB' }}
                            >
                                {greeting}
                            </h1>

                            <div className="max-w-3xl mx-auto">
                                <h2
                                    className={`text-2xl lg:text-3xl font-bold text-center mb-6 lg:mb-8 ${darkMode ? 'text-white' : 'text-gray-800'
                                        }`}
                                >
                                    My Tasks
                                </h2>

                                {/* Add Task Input */}
                                <div className="mb-6">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="text"
                                            id="task-input"
                                            name="task"
                                            placeholder="Type your task here.."
                                            value={newTask}
                                            onChange={(e) => setNewTask(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && !addingTask && !showReminderFields && addTask()}
                                            disabled={addingTask}
                                            className={`flex-1 px-4 py-3 rounded-lg ${darkMode
                                                ? 'bg-gray-800 text-white placeholder-gray-400 border border-gray-700'
                                                : 'bg-white text-gray-900 border border-gray-200'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                                        />
                                        <button
                                            onClick={() => setShowReminderFields(!showReminderFields)}
                                            className={`px-4 py-3 font-semibold rounded-lg transition-all ${darkMode
                                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                }`}
                                            aria-label="Set reminder"
                                        >
                                            {showReminderFields ? '−' : <LuAlarmClock className="text-xl" />}
                                        </button>
                                        <button
                                            onClick={addTask}
                                            disabled={addingTask}
                                            className="px-6 py-3 text-white font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ backgroundColor: '#1F41BB' }}
                                        >
                                            {addingTask ? 'Adding...' : '+ Add'}
                                        </button>
                                    </div>

                                    {/* Reminder Fields */}
                                    {showReminderFields && (
                                        <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        Due Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="due-date"
                                                        name="dueDate"
                                                        value={dueDate}
                                                        onChange={(e) => setDueDate(e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        style={{ colorScheme: darkMode ? 'dark' : 'light' }}
                                                        className={`w-full px-3 py-2 rounded-lg ${darkMode
                                                            ? 'bg-gray-700 text-white border-gray-600'
                                                            : 'bg-white text-gray-900 border-gray-300'
                                                            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        Due Time
                                                    </label>
                                                    <input
                                                        type="time"
                                                        id="due-time"
                                                        name="dueTime"
                                                        value={dueTime}
                                                        onChange={(e) => setDueTime(e.target.value)}
                                                        style={{ colorScheme: darkMode ? 'dark' : 'light' }}
                                                        className={`w-full px-3 py-2 rounded-lg ${darkMode
                                                            ? 'bg-gray-700 text-white border-gray-600'
                                                            : 'bg-white text-gray-900 border-gray-300'
                                                            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Filter Tabs */}
                                <div className="flex gap-4 mb-6 text-sm lg:text-base">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`transition-colors ${filter === 'all'
                                            ? darkMode
                                                ? 'text-blue-400 font-semibold'
                                                : 'text-blue-600 font-semibold'
                                            : darkMode
                                                ? 'text-gray-400 hover:text-gray-300'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        All
                                    </button>
                                    <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>
                                        |
                                    </span>
                                    <button
                                        onClick={() => setFilter('active')}
                                        className={`transition-colors ${filter === 'active'
                                            ? darkMode
                                                ? 'text-blue-400 font-semibold'
                                                : 'text-blue-600 font-semibold'
                                            : darkMode
                                                ? 'text-gray-400 hover:text-gray-300'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Active
                                    </button>
                                    <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>
                                        |
                                    </span>
                                    <button
                                        onClick={() => setFilter('completed')}
                                        className={`transition-colors ${filter === 'completed'
                                            ? darkMode
                                                ? 'text-blue-400 font-semibold'
                                                : 'text-blue-600 font-semibold'
                                            : darkMode
                                                ? 'text-gray-400 hover:text-gray-300'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Completed
                                    </button>
                                </div>

                                {/* Loading State */}
                                {loading ? (
                                    <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Loading tasks...
                                    </div>
                                ) : (
                                    <TaskList
                                        tasks={getFilteredTasks()}
                                        darkMode={darkMode}
                                        onToggle={toggleTask}
                                        onDelete={deleteTask}
                                        onUpdate={updateTask}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <Footer darkMode={darkMode} />
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;