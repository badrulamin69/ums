package com.smartuniversity.admission.entity;

import com.smartuniversity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ssc_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SscResult extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false, unique = true)
    private Applicant applicant;

    @Column(nullable = false, length = 50)
    private String board;

    @Column(nullable = false)
    private int examYear;

    @Column(nullable = false, length = 30)
    private String rollNumber;

    @Column(length = 30)
    private String registrationNumber;

    @Column(nullable = false, length = 30)
    private String group;

    @Column(length = 150)
    private String institution;

    @Column(nullable = false, precision = 4, scale = 2)
    private Double gpa;

    @Column(precision = 4, scale = 2)
    private Double scienceGpa;

    @Column(precision = 4, scale = 2)
    private Double mathGpa;

    @Column(nullable = false)
    private boolean verified = false;
}
