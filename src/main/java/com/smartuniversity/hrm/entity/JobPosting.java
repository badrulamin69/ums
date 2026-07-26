package com.smartuniversity.hrm.entity;

import com.smartuniversity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "job_postings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPosting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false)
    private int vacancies;

    @Column(nullable = false)
    private LocalDate postingDate;

    @Column(nullable = false)
    private LocalDate closingDate;

    @Column(nullable = false)
    private boolean active = true;
}
