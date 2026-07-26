package com.smartuniversity.academic.entity;

import com.smartuniversity.common.BaseEntity;
import com.smartuniversity.student.entity.Student;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "year_results",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "year_level_id", "academic_session_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YearResult extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "year_level_id", nullable = false)
    private YearLevel yearLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_session_id", nullable = false)
    private AcademicSession academicSession;

    @Column(nullable = false)
    private Double gpa;

    @Column(nullable = false)
    private double totalCreditHours;

    @Column(nullable = false)
    private double totalGradePoints;
}
