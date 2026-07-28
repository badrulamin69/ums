package com.smartuniversity.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {}: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendVerificationEmail(String to, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;
        sendEmail(to, "Smart University - Email Verification",
                "Please verify your email by clicking: " + link);
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        sendEmail(to, "Smart University - Password Reset",
                "Reset your password by clicking: " + link);
    }

    @Async
    public void sendAdmitCardEmail(String to, String admitCardNumber) {
        sendEmail(to, "Smart University - Admit Card Generated",
                "Your admit card has been generated successfully.\n\nAdmit Card Number: " + admitCardNumber +
                "\n\nPlease login to your dashboard to view and download it.");
    }

    @Async
    public void sendAdmissionStatusEmail(String to, String status, String circularTitle) {
        sendEmail(to, "Smart University - Admission Status Update",
                "Your application for " + circularTitle + " has been updated to: " + status);
    }
}
