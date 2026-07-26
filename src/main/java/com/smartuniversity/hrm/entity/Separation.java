package com.smartuniversity.hrm.entity;

import com.smartuniversity.common.BaseEntity;
import com.smartuniversity.common.enums.SeparationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "separations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Separation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeparationType type;

    @Column(nullable = false)
    private LocalDate effectiveDate;

    @Column(length = 500)
    private String reason;

    @Column(nullable = false)
    private boolean approved = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id")
    private ApprovalWorkflow workflow;
}
