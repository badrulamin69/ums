package com.smartuniversity.payroll.entity;

import com.smartuniversity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "salary_structures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryStructure extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_id", nullable = false, unique = true)
    private com.smartuniversity.hrm.entity.Grade grade;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal basicSalary;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal houseAllowance;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal medicalAllowance;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal transportAllowance;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal taxRate;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal providentFundRate;
}
