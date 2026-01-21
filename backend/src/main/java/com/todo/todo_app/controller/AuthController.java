/**
 * Authuntication Controller
 * Handles user authentication and registration
 */

package com.todo.todo_app.controller;

import com.todo.todo_app.model.User;
import com.todo.todo_app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    // account creation
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // account login
    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        User user = userService.loginUser(email, password);

        if (user == null) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }
}