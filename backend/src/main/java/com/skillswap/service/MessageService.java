package com.skillswap.service;

import com.skillswap.dto.MessageDtos;
import com.skillswap.entity.Message;
import com.skillswap.entity.User;
import com.skillswap.exception.ApiException;
import com.skillswap.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public MessageDtos.MessageDto sendMessage(Long senderId, MessageDtos.SendMessageRequest request) {
        if (senderId.equals(request.getReceiverId())) {
            throw new ApiException("You cannot send a message to yourself", HttpStatus.BAD_REQUEST);
        }

        User sender = userService.getUserById(senderId);
        User receiver = userService.getUserById(request.getReceiverId());

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent().trim())
                .isRead(false)
                .build();

        Message saved = messageRepository.save(message);

        String preview = saved.getContent().length() > 80
                ? saved.getContent().substring(0, 80) + "..."
                : saved.getContent();
        notificationService.create(receiver, sender,
                sender.getFullName() + " sent you a message: \"" + preview + "\"",
                "NEW_MESSAGE");

        return toDto(saved);
    }

    @Transactional
    public List<MessageDtos.MessageDto> getConversation(Long userId, Long partnerId) {
        // ensure partner exists
        userService.getUserById(partnerId);

        List<Message> messages = messageRepository.findConversation(userId, partnerId);

        List<Message> unread = messages.stream()
                .filter(m -> m.getReceiver().getId().equals(userId) && !m.isRead())
                .collect(Collectors.toList());
        unread.forEach(m -> m.setRead(true));
        messageRepository.saveAll(unread);

        return messages.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageDtos.ConversationDto> getConversations(Long userId) {
        List<Message> allMessages = messageRepository.findAllForUser(userId);

        Map<Long, List<Message>> grouped = new LinkedHashMap<>();
        for (Message m : allMessages) {
            Long partnerId = m.getSender().getId().equals(userId) ? m.getReceiver().getId() : m.getSender().getId();
            grouped.computeIfAbsent(partnerId, k -> new ArrayList<>()).add(m);
        }

        List<MessageDtos.ConversationDto> conversations = new ArrayList<>();
        for (Map.Entry<Long, List<Message>> entry : grouped.entrySet()) {
            Long partnerId = entry.getKey();
            List<Message> msgs = entry.getValue();
            Message last = msgs.get(0); // already sorted desc from query
            User partner = last.getSender().getId().equals(partnerId) ? last.getSender() : last.getReceiver();

            long unread = messageRepository.countByReceiver_IdAndSender_IdAndIsReadFalse(userId, partnerId);

            conversations.add(MessageDtos.ConversationDto.builder()
                    .partnerId(partner.getId())
                    .partnerName(partner.getFullName())
                    .partnerPhotoUrl(partner.getPhotoUrl())
                    .lastMessage(last.getContent())
                    .lastMessageAt(last.getSentAt())
                    .unreadCount(unread)
                    .build());
        }

        conversations.sort((a, b) -> b.getLastMessageAt().compareTo(a.getLastMessageAt()));
        return conversations;
    }

    private MessageDtos.MessageDto toDto(Message m) {
        return MessageDtos.MessageDto.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getFullName())
                .senderPhotoUrl(m.getSender().getPhotoUrl())
                .receiverId(m.getReceiver().getId())
                .receiverName(m.getReceiver().getFullName())
                .content(m.getContent())
                .sentAt(m.getSentAt())
                .isRead(m.isRead())
                .build();
    }
}
