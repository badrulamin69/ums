package com.smartuniversity.payment.controller;

import com.smartuniversity.common.ApiResponse;
import com.smartuniversity.payment.dto.*;
import com.smartuniversity.payment.service.PaymentService;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.repository.UserRepository;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    public PaymentController(PaymentService paymentService, UserRepository userRepository) {
        this.paymentService = paymentService;
        this.userRepository = userRepository;
    }

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<PaymentResponse>> initiate(
            @Valid @RequestBody PaymentInitiateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment initiated", paymentService.initiate(request, user.getId())));
    }

    @GetMapping("/{transactionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PAYROLL') or hasRole('ADMISSION') or @resourceSecurity.isPaymentOwner(#transactionId)")
    public ResponseEntity<ApiResponse<PaymentResponse>> getByTransactionId(@PathVariable String transactionId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getByTransactionId(transactionId)));
    }

    @GetMapping("/callback")
    public void handleCallbackGet(
            @RequestParam String transactionId, @RequestParam String status,
            @RequestParam(required = false) String val_id,
            @RequestParam(required = false) String amount,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) String tran_id,
            HttpServletResponse response) throws Exception {
        String effectiveTranId = transactionId != null ? transactionId : tran_id;
        paymentService.handleCallback(effectiveTranId, status, val_id, amount, currency);
        paymentService.onPaymentCompleted(effectiveTranId);
        response.sendRedirect(frontendUrl + "/student/payment-result?transactionId=" + effectiveTranId + "&status=" + status);
    }

    @PostMapping("/callback")
    public void handleCallbackPost(
            @RequestParam String transactionId, @RequestParam String status,
            @RequestParam(required = false) String val_id,
            @RequestParam(required = false) String valId,
            @RequestParam(required = false) String amount,
            @RequestParam(required = false) String currency,
            HttpServletResponse response) throws Exception {
        String effectiveValId = val_id != null ? val_id : valId;
        paymentService.handleCallback(transactionId, status, effectiveValId, amount, currency);
        paymentService.onPaymentCompleted(transactionId);
        response.sendRedirect(frontendUrl + "/student/payment-result?transactionId=" + transactionId + "&status=" + status);
    }
}
