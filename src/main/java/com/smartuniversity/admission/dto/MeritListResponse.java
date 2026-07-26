package com.smartuniversity.admission.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeritListResponse {

    private Long id;
    private Long circularId;
    private Long departmentId;
    private String departmentName;
    private Long applicantId;
    private String applicantName;
    private String applicationNumber;
    private Double meritScore;
    private int meritPosition;
    private boolean published;
}
