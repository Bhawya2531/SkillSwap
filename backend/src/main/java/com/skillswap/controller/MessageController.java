package com.skillswap.controller;

import com.skillswap.dto.MessageDtos;
import com.skillswap.entity.User;
import com.skillswap.service.MessageService;
import com.skillswap.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<MessageDtos.MessageDto> sendMessage(
            Authentication authentication,
            @Valid @RequestBody MessageDtos.SendMessageRequest request) {
        User current = userService.getUserByEmail(authentication.getName());
        MessageDtos.MessageDto message = messageService.sendMessage(current.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<MessageDtos.ConversationDto>> getConversations(Authentication authentication) {
        User current = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(messageService.getConversations(current.getId()));
    }

    @GetMapping("/{partnerId}")
    public ResponseEntity<List<MessageDtos.MessageDto>> getConversation(
            Authentication authentication,
            @PathVariable Long partnerId) {
        User current = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(messageService.getConversation(current.getId(), partnerId));
    }
}
