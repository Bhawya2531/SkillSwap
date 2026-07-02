package com.skillswap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private String content;
    private String type;
    private boolean isRead;
    private LocalDateTime createdAt;
    private Long actorId;
    private String actorName;
    private String actorPhotoUrl;
}
