package com.smartuniversity.admission.controller;

import com.smartuniversity.admission.dto.AdmitCardResponse;
import com.smartuniversity.admission.service.AdmitCardService;
import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.repository.UserRepository;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/admit-cards")
public class AdmitCardController {

    private final AdmitCardService admitCardService;
    private final UserRepository userRepository;

    public AdmitCardController(AdmitCardService admitCardService, UserRepository userRepository) {
        this.admitCardService = admitCardService;
        this.userRepository = userRepository;
    }

    @PostMapping("/generate/{applicantId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION')")
    public ResponseEntity<ApiResponse<AdmitCardResponse>> generate(@PathVariable Long applicantId) {
        AdmitCardResponse response = admitCardService.generate(applicantId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Admit card generated", response));
    }

    @GetMapping("/applicant/{applicantId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADMISSION') or @resourceSecurity.isApplicantOwner(#applicantId)")
    public ResponseEntity<ApiResponse<AdmitCardResponse>> getByApplicant(@PathVariable Long applicantId) {
        return ResponseEntity.ok(ApiResponse.success(admitCardService.getByApplicantId(applicantId)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<AdmitCardResponse>> getMyAdmitCard(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        AdmitCardResponse response = admitCardService.getByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/my/download")
    public ResponseEntity<byte[]> downloadMyAdmitCard(
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        AdmitCardResponse card = admitCardService.getByUserId(user.getId());

        byte[] pdfBytes = admitCardService.generatePdf(card.getApplicantId());
        admitCardService.markAsDownloaded(card.getApplicantId());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment",
                "admit-card-" + card.getAdmitCardNumber() + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @PostMapping("/my/mark-downloaded")
    public ResponseEntity<ApiResponse<Void>> markAsDownloaded(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        AdmitCardResponse card = admitCardService.getByUserId(user.getId());
        admitCardService.markAsDownloaded(card.getApplicantId());
        return ResponseEntity.ok(ApiResponse.success("Admit card marked as downloaded", null));
    }
}
