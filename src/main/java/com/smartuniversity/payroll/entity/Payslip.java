package com.smartuniversity.payroll.entity;

import com.smartuniversity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "payslips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payslip extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_run_id", nullable = false)
    private PayrollRun payrollRun;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private com.smartuniversity.hrm.entity.Employee employee;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal basicSalary;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal houseAllowance;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal medicalAllowance;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal transportAllowance;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal grossSalary;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal taxDeduction;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal providentFundDeduction;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal netSalary;
}
