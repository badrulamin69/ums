package com.smartuniversity.notification.socket;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import com.smartuniversity.security.jwt.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "socketio.enabled", havingValue = "true", matchIfMissing = true)
public class SocketIOConfig {

    private static final Logger log = LoggerFactory.getLogger(SocketIOConfig.class);

    private final JwtTokenProvider tokenProvider;
    private SocketIOServer server;

    @Value("${socketio.port:9090}")
    private int port;

    @Value("${socketio.host:0.0.0.0}")
    private String host;

    public SocketIOConfig(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @PostConstruct
    public void start() {
        Configuration config = new Configuration();
        config.setPort(port);
        config.setHostname(host);

        config.setAuthorizationListener(handshakeData -> {
            String token = extractToken(handshakeData);
            if (token == null || token.isEmpty()) return false;
            try {
                return tokenProvider.validateToken(token) && "access".equals(tokenProvider.getTokenType(token));
            } catch (Exception e) {
                return false;
            }
        });

        server = new SocketIOServer(config);

        server.addConnectListener(client -> {
            String token = extractToken(client.getHandshakeData());
            if (token != null && !token.isEmpty()) {
                try {
                    String email = tokenProvider.getEmailFromToken(token);
                    client.joinRoom("user_" + email);
                    client.sendEvent("connected", Map.of("email", email));
                    log.info("Socket connected: user={}", email);
                } catch (Exception e) {
                    log.error("Socket auth error", e);
                    client.disconnect();
                }
            }
        });

        server.start();
        log.info("Socket.IO server started on port {}", port);
    }

    private String extractToken(com.corundumstudio.socketio.HandshakeData handshakeData) {
        String authHeader = handshakeData.getHttpHeaders().get("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return handshakeData.getSingleUrlParam("token");
    }

    @PreDestroy
    public void stop() {
        if (server != null) {
            server.stop();
            log.info("Socket.IO server stopped");
        }
    }

    public SocketIOServer getServer() {
        return server;
    }
}
