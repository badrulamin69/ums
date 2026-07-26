package com.smartuniversity.notification.socket;

import com.smartuniversity.common.enums.NotificationType;
import com.smartuniversity.notification.entity.NotificationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class SocketIOEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(SocketIOEventPublisher.class);

    private final SocketIOConfig socketIOConfig;

    public SocketIOEventPublisher(SocketIOConfig socketIOConfig) {
        this.socketIOConfig = socketIOConfig;
    }

    public void sendNotification(String email, NotificationEvent event) {
        try {
            socketIOConfig.getServer().getRoomOperations("user_" + email)
                    .sendEvent("notification", Map.of(
                            "id", event.getId(),
                            "type", event.getType().name(),
                            "title", event.getTitle(),
                            "message", event.getMessage(),
                            "createdAt", event.getCreatedAt().toString()
                    ));
        } catch (Exception e) {
            log.error("Failed to send socket notification to {}: {}", email, e.getMessage());
        }
    }
}
