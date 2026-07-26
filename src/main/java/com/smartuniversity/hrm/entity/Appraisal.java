package com.smartuniversity.hrm.entity;

import com.smartuniversity.common.BaseEntity;
import com.smartuniversity.common.enums.AppraisalRating;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "appraisals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appraisal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private LocalDate appraisalDate;

    @Column(nullable = false)
    private int reviewYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppraisalRating rating;

    @Column(length = 1000)
    private String comments;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private Employee reviewer;
}
