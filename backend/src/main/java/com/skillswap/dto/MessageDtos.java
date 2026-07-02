package com.skillswap.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class MessageDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SendMessageRequest {
        @NotNull(message = "Receiver id is required")
        private Long receiverId;

        @NotBlank(message = "Message content cannot be empty")
        private String content;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageDto {
        private Long id;
        private Long senderId;
        private String senderName;
        private String senderPhotoUrl;
        private Long receiverId;
        private String receiverName;
        private String content;
        private LocalDateTime sentAt;
        private boolean isRead;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConversationDto {
        private Long partnerId;
        private String partnerName;
        private String partnerPhotoUrl;
        private String lastMessage;
        private LocalDateTime lastMessageAt;
        private long unreadCount;
    }
}
