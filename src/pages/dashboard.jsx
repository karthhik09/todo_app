import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/footer';
import TaskList from '../components/tasklist';
import useGreeting from '../hooks/greetings';
import { tasksAPI } from '../services/api';

function DashboardPage({ darkMode, setDarkMode, onNavigate, sidebarOpen, setSidebarOpen, currentUser }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [addingTask, setAddingTask] = useState(false);
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
                completed: task.status
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
                const task = await tasksAPI.addTask(newTask.trim(), false, currentUser?.userId);
                console.log('Task added successfully:', task);
                // Add new task to the list
                setTasks([
                    ...tasks,
                    { id: task.taskId, text: task.title, completed: task.status }
                ]);
                setNewTask('');
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

                <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-4 lg:p-8">
                        <div className="max-w-5xl mx-auto">
                            <Header
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                                sidebarOpen={sidebarOpen}
                                setSidebarOpen={setSidebarOpen}
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
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <input
                                        type="text"
                                        placeholder="Type your task here.."
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && !addingTask && addTask()}
                                        disabled={addingTask}
                                        className={`flex-1 px-4 py-3 rounded-lg ${darkMode
                                            ? 'bg-gray-800 text-white placeholder-gray-400 border border-gray-700'
                                            : 'bg-white text-gray-900 border border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                                    />
                                    <button
                                        onClick={addTask}
                                        disabled={addingTask}
                                        className="px-6 py-3 text-white font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: '#1F41BB' }}
                                    >
                                        {addingTask ? 'Adding...' : '+ Add'}
                                    </button>
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