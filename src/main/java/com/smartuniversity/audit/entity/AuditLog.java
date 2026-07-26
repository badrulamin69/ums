package com.smartuniversity.audit.entity;

import com.smartuniversity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String entityType;

    private Long entityId;

    @Column(nullable = false, length = 20)
    private String action;

    @Column(length = 100)
    private String performedBy;

    @Column(length = 2000)
    private String details;
}
