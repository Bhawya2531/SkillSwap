package com.skillswap.controller;

import com.skillswap.dto.NotificationDto;
import com.skillswap.entity.User;
import com.skillswap.service.NotificationService;
import com.skillswap.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(Authentication authentication) {
        User current = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(notificationService.getForUser(current.getId()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        User current = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(current.getId())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(Authentication authentication, @PathVariable Long id) {
        User current = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(notificationService.markAsRead(id, current.getId()));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        User current = userService.getUserByEmail(authentication.getName());
        notificationService.markAllAsRead(current.getId());
        return ResponseEntity.noContent().build();
    }
}
