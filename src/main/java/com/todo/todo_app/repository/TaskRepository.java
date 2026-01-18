package com.todo.todo_app.repository;

import com.todo.todo_app.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserUserId(Long userId);

    @Query("SELECT t FROM Task t WHERE t.dueDateTime IS NOT NULL AND t.dueDateTime >= :now")
    List<Task> findTasksWithDueDates(LocalDateTime now);
}