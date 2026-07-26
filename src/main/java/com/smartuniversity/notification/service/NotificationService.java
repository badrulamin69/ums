package com.smartuniversity.notification.service;

import com.smartuniversity.common.enums.NotificationType;
import com.smartuniversity.notification.dto.NotificationResponse;
import com.smartuniversity.notification.entity.NotificationEvent;
import com.smartuniversity.notification.repository.NotificationRepository;
import com.smartuniversity.notification.socket.SocketIOEventPublisher;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.repository.UserRepository;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SocketIOEventPublisher eventPublisher;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               SocketIOEventPublisher eventPublisher,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.eventPublisher = eventPublisher;
        this.userRepository = userRepository;
    }

    @Transactional
    public void notify(Long userId, NotificationType type, String title, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        NotificationEvent event = NotificationEvent.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .build();
        event = notificationRepository.save(event);

        eventPublisher.sendNotification(user.getEmail(), event);
    }

    public Page<NotificationResponse> getByUserId(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toResponse);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        NotificationEvent event = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("NotificationEvent", "id", notificationId));
        event.setRead(true);
        event.setReadAt(LocalDateTime.now());
        notificationRepository.save(event);
    }

    private NotificationResponse toResponse(NotificationEvent event) {
        return NotificationResponse.builder()
                .id(event.getId())
                .type(event.getType().name())
                .title(event.getTitle())
                .message(event.getMessage())
                .read(event.isRead())
                .readAt(event.getReadAt())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
