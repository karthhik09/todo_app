/**
 * Task Service
 * Handles task management operations
 */

package com.todo.todo_app.service;

import com.todo.todo_app.model.Task;
import com.todo.todo_app.model.User;
import com.todo.todo_app.repository.TaskRepository;
import com.todo.todo_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // Fetch tasks for a specific userid
    public List<Task> getTasksForUser(Long userId) {
        return taskRepository.findByUserUserId(userId);
    }

    // Create a task for a specific userid
    public Task createTask(Task task, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        task.setUser(user);
        return taskRepository.save(task);
    }

    // delete a task
    @Transactional
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    // change the status
    public Task toggleTask(Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.setStatus(!task.isStatus());
        return taskRepository.save(task);
    }

    // edit the task
    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setTitle(taskDetails.getTitle());
        task.setStatus(taskDetails.isStatus());
        return taskRepository.save(task);
    }
}