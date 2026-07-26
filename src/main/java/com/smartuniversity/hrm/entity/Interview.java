package com.smartuniversity.hrm.entity;

import com.smartuniversity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_application_id", nullable = false)
    private JobApplication jobApplication;

    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    @Column(length = 255)
    private String location;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private boolean completed = false;

    private Double score;
}
