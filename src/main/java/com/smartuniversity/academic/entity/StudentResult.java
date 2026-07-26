package com.smartuniversity.academic.entity;

import com.smartuniversity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_results",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id", "academic_session_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResult extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private com.smartuniversity.student.entity.Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_session_id", nullable = false)
    private AcademicSession academicSession;

    @Column(nullable = false)
    private Double gradePoint;

    @Column(nullable = false)
    private double creditHours;

    @Column(length = 5)
    private String letterGrade;

    @Column(nullable = false)
    private boolean published = false;
}
