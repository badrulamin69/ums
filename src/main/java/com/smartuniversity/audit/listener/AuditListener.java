package com.smartuniversity.audit.listener;

import com.smartuniversity.audit.entity.AuditLog;
import com.smartuniversity.audit.repository.AuditLogRepository;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuditListener {

    @PrePersist
    public void prePersist(Object entity) {
        createAuditLog(entity, "CREATE");
    }

    @PreUpdate
    public void preUpdate(Object entity) {
        createAuditLog(entity, "UPDATE");
    }

    private void createAuditLog(Object entity, String action) {
        String email = "system";
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User user) {
            email = user.getUsername();
        }

        AuditLog log = AuditLog.builder()
                .entityType(entity.getClass().getSimpleName())
                .action(action)
                .performedBy(email)
                .details(action + " on " + entity.getClass().getSimpleName())
                .build();

        try {
            AuditLogRepository repo = SpringContextUtil.getBean(AuditLogRepository.class);
            if (repo != null) {
                repo.save(log);
            }
        } catch (Exception ignored) {
        }
    }
}
