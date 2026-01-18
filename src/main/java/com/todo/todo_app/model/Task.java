package com.todo.todo_app.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.ZoneId;

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
        ZoneId istZone = ZoneId.of("Asia/Kolkata");
        ZonedDateTime nowIST = ZonedDateTime.now(istZone);
        createdAt = nowIST.toLocalDateTime();
        updatedAt = nowIST.toLocalDateTime();
    }

    public enum ReminderType {
        FIFTEEN_MINUTES,
        ONE_HOUR,
        CUSTOM
    }
}