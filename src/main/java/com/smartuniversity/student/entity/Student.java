package com.smartuniversity.student.entity;

import com.smartuniversity.admission.entity.Applicant;
import com.smartuniversity.common.BaseEntity;
import com.smartuniversity.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", unique = true)
    private Applicant applicant;

    @Column(nullable = false, unique = true, length = 30)
    private String registrationNumber;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(length = 100)
    private String middleName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false)
    private Double cgpa = 0.0;

    @Column(nullable = false)
    private boolean active = true;
}
