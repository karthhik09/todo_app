/**
 * Task Controller
 * Handles task management operations
 */

package com.todo.todo_app.controller;

import com.todo.todo_app.model.Task;
import com.todo.todo_app.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // GET task by userid
    @GetMapping
    public List<Task> getTasks(@RequestParam Long userId) {
        return taskService.getTasksForUser(userId);
    }

    // POST task by userid
    @PostMapping
    public Task createTask(@RequestBody Task task, @RequestParam Long userId) {
        return taskService.createTask(task, userId);
    }

    // DELETE task by id
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    // PUT task by id
    @PutMapping("/{id}/toggle")
    public Task toggleTask(@PathVariable Long id) {
        return taskService.toggleTask(id);
    }

    // Put task by id
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        return taskService.updateTask(id, taskDetails);
    }
}