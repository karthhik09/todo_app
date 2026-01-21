import React, { useState } from 'react';
import { MdEdit, MdDelete, MdCheck, MdClose } from 'react-icons/md';

function TaskItem({ task, darkMode, onToggle, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);

    const handleSave = () => {
        if (editText.trim()) {
            onUpdate(task.id, editText);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditText(task.text);
        setIsEditing(false);
    };

    return (
        <div
            className={`flex items-center justify-between p-4 rounded-lg transition-shadow ${darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow hover:shadow-md`}
        >
            {isEditing ? (
                // Edit Mode
                <>
                    <div className="flex items-center space-x-3 flex-1">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onToggle(task.id)}
                            className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                            className={`flex-1 px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-gray-900 border-gray-300'
                                }`}
                            autoFocus
                        />
                    </div>

                    <div className="flex space-x-2 ml-2">
                        <button
                            onClick={handleSave}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            aria-label="Save"
                        >
                            <MdCheck className="text-xl" />
                        </button>
                        <button
                            onClick={handleCancel}
                            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            aria-label="Cancel"
                        >
                            <MdClose className="text-xl" />
                        </button>
                    </div>
                </>
            ) : (
                // View Mode
                <>
                    <div className="flex items-center space-x-3 flex-1">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => onToggle(task.id)}
                            className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                        />
                        <div className="flex-1">
                            <span
                                className={`${task.completed ? 'line-through opacity-50' : ''} ${darkMode ? 'text-white' : 'text-gray-900'
                                    }`}
                            >
                                {task.text}
                            </span>
                            {task.dueDateTime && (
                                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Due: {(() => {
                                        const date = new Date(task.dueDateTime);
                                        const day = date.getDate().toString().padStart(2, '0');
                                        const month = date.toLocaleString('en-US', { month: 'short' });
                                        const year = date.getFullYear();
                                        const time = date.toLocaleString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        });
                                        return `${day} ${month} ${year} at ${time}`;
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className={`p-2 rounded-lg transition-colors ${darkMode
                                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                            aria-label="Edit task"
                        >
                            <MdEdit className="text-xl" />
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            className={`p-2 rounded-lg transition-colors ${darkMode
                                ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                                : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                                }`}
                            aria-label="Delete task"
                        >
                            <MdDelete className="text-xl" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default TaskItem;