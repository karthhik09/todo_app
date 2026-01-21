/**
 * User Service
 * Handles user management operations
 */

package com.todo.todo_app.service;

import com.todo.todo_app.model.User;
import com.todo.todo_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // register user
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    // user login
    public User loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        return null; // Login failed
    }
}