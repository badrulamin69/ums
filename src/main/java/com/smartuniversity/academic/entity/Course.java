package com.smartuniversity.academic.entity;

import com.smartuniversity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String courseCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false)
    private double creditHours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "year_level_id", nullable = false)
    private YearLevel yearLevel;

    @Column(nullable = false)
    private boolean active = true;
}
