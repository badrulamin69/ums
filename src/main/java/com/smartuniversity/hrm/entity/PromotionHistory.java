package com.smartuniversity.hrm.entity;

import com.smartuniversity.common.BaseEntity;
import com.smartuniversity.common.enums.PromotionType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "promotion_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionHistory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_designation_id")
    private Designation fromDesignation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_designation_id")
    private Designation toDesignation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_grade_id")
    private Grade fromGrade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_grade_id")
    private Grade toGrade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromotionType type;

    @Column(nullable = false)
    private LocalDate effectiveDate;

    @Column(length = 500)
    private String remarks;
}
