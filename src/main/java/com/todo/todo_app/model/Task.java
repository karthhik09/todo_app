package com.todo.todo_app.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    private String title;

    private boolean status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Notification fields
    private LocalDateTime dueDateTime;
    
    @Enumerated(EnumType.STRING)
    private ReminderType reminderType;
    
    private Integer customReminderMinutes;
    
    private LocalDateTime lastNotificationSent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    public enum ReminderType {
        FIFTEEN_MINUTES,
        ONE_HOUR,
        CUSTOM
    }
}