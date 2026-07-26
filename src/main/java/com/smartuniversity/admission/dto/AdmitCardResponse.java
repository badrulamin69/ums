package com.smartuniversity.admission.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmitCardResponse {

    private Long id;
    private Long applicantId;
    private String applicationNumber;
    private String admitCardNumber;
    private LocalDateTime examDate;
    private String examCenter;
    private boolean downloaded;
}
