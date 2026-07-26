package com.smartuniversity.admission.entity;

import com.smartuniversity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "admit_cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmitCard extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false, unique = true)
    private Applicant applicant;

    @Column(nullable = false, length = 50)
    private String admitCardNumber;

    @Column(nullable = false)
    private LocalDateTime examDate;

    @Column(length = 255)
    private String examCenter;

    @Column(nullable = false)
    private boolean downloaded = false;
}
