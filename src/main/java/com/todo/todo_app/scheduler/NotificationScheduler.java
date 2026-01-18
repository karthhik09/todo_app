package com.todo.todo_app.scheduler;

import com.todo.todo_app.model.Notification;
import com.todo.todo_app.model.Task;
import com.todo.todo_app.repository.NotificationRepository;
import com.todo.todo_app.repository.TaskRepository;
import com.todo.todo_app.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class NotificationScheduler {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    // Run every minute
    @Scheduled(cron = "0 * * * * *")
    public void checkTasksForNotifications() {
        // Use IST timezone for accurate time comparison
        ZoneId istZone = ZoneId.of("Asia/Kolkata");
        ZonedDateTime nowZoned = ZonedDateTime.now(istZone);
        LocalDateTime now = nowZoned.toLocalDateTime();

        List<Task> tasksWithDueDates = taskRepository.findTasksWithDueDates(now);

        System.out.println("\n=== Notification Scheduler Running at " + nowZoned + " (IST) ===");
        System.out.println("Found " + tasksWithDueDates.size() + " tasks with due dates");

        for (Task task : tasksWithDueDates) {
            if (task.getDueDateTime() == null || task.getReminderType() == null) {
                continue;
            }

            LocalDateTime dueDateTime = task.getDueDateTime();

            // Calculate when to send reminder based on reminder type
            LocalDateTime reminderTime = calculateReminderTime(task);

            if (reminderTime == null) {
                continue;
            }

            System.out.println("\nTask: " + task.getTitle());
            System.out.println("  Due DateTime: " + dueDateTime);
            System.out.println("  Reminder Time: " + reminderTime);
            System.out.println("  Current Time: " + now);

            // Check if REMINDER notification already sent
            boolean reminderSent = notificationRepository.existsByTaskIdAndType(
                    task.getTaskId(),
                    Notification.NotificationType.REMINDER);

            // Check if DUE notification already sent
            boolean dueSent = notificationRepository.existsByTaskIdAndType(
                    task.getTaskId(),
                    Notification.NotificationType.TASK_DUE_SOON);

            System.out.println("  Reminder notification sent: " + reminderSent);
            System.out.println("  Due notification sent: " + dueSent);

            // Send REMINDER notification (both in-app and email) if we're at or past reminder time (but before due time)
            if (!reminderSent && (now.isEqual(reminderTime) || now.isAfter(reminderTime))
                    && now.isBefore(dueDateTime)) {
                long minutesUntilDue = ChronoUnit.MINUTES.between(now, dueDateTime);
                String message;

                if (minutesUntilDue > 60) {
                    long hours = minutesUntilDue / 60;
                    message = String.format("Reminder: Task '%s' is due in %d hour%s",
                            task.getTitle(), hours, hours > 1 ? "s" : "");
                } else {
                    message = String.format("Reminder: Task '%s' is due in %d minute%s",
                            task.getTitle(), minutesUntilDue, minutesUntilDue != 1 ? "s" : "");
                }

                System.out.println("  ✓ Sending REMINDER notification (in-app + email): " + message);

                // Create in-app notification (will be visible in notification bell)
                notificationService.createNotification(
                        task.getUser().getUserId(),
                        task.getTaskId(),
                        message,
                        Notification.NotificationType.REMINDER);

                // TODO: Trigger frontend email sending via WebSocket or polling
            } else if (reminderSent) {
                System.out.println("  ✗ REMINDER already sent");
            } else {
                System.out.println("  ✗ Not time for REMINDER yet (current < reminder time)");
            }

            // Send DUE notification (both email and in-app) if we're at or past due time
            if (!dueSent && (now.isEqual(dueDateTime) || now.isAfter(dueDateTime))) {
                String message = String.format("Task '%s' is due now!", task.getTitle());

                System.out.println("  ✓ Sending DUE notification (in-app + email): " + message);

                // Create in-app notification (will be visible in notification bell)
                notificationService.createNotification(
                        task.getUser().getUserId(),
                        task.getTaskId(),
                        message,
                        Notification.NotificationType.TASK_DUE_SOON);

                // TODO: Trigger frontend email sending via WebSocket or polling
            } else if (dueSent) {
                System.out.println("  ✗ DUE notification already sent");
            } else {
                System.out.println("  ✗ Not time for DUE notification yet (current < due time)");
            }
        }

        System.out.println("\n=== Scheduler Complete ===\n");
    }

    private LocalDateTime calculateReminderTime(Task task) {
        LocalDateTime dueDateTime = task.getDueDateTime();

        switch (task.getReminderType()) {
            case FIFTEEN_MINUTES:
                return dueDateTime.minusMinutes(15);
            case ONE_HOUR:
                return dueDateTime.minusHours(1);
            case CUSTOM:
                if (task.getCustomReminderMinutes() != null) {
                    return dueDateTime.minusMinutes(task.getCustomReminderMinutes());
                }
                return null;
            default:
                return null;
        }
    }
}
