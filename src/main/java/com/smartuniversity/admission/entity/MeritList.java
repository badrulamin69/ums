package com.smartuniversity.admission.entity;

import com.smartuniversity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "merit_lists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeritList extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "circular_id", nullable = false)
    private AdmissionCircular circular;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private Applicant applicant;

    @Column(nullable = false)
    private Double meritScore;

    @Column(nullable = false)
    private int meritPosition;

    @Column(nullable = false)
    private boolean published = false;

    private LocalDateTime publishedAt;
}
