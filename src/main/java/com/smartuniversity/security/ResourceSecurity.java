package com.smartuniversity.security;

import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.repository.UserRepository;
import com.smartuniversity.student.repository.StudentRepository;
import com.smartuniversity.hrm.repository.EmployeeRepository;
import com.smartuniversity.admission.repository.ApplicantRepository;
import com.smartuniversity.notification.repository.NotificationRepository;
import com.smartuniversity.notification.entity.NotificationEvent;
import com.smartuniversity.payment.repository.PaymentRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("resourceSecurity")
public class ResourceSecurity {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final EmployeeRepository employeeRepository;
    private final ApplicantRepository applicantRepository;
    private final NotificationRepository notificationRepository;
    private final PaymentRepository paymentRepository;

    public ResourceSecurity(UserRepository userRepository,
                            StudentRepository studentRepository,
                            EmployeeRepository employeeRepository,
                            ApplicantRepository applicantRepository,
                            NotificationRepository notificationRepository,
                            PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.employeeRepository = employeeRepository;
        this.applicantRepository = applicantRepository;
        this.notificationRepository = notificationRepository;
        this.paymentRepository = paymentRepository;
    }

    public boolean isOwner(Long resourceUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.User springUser) {
            return userRepository.findByEmail(springUser.getUsername())
                    .map(user -> user.getId().equals(resourceUserId))
                    .orElse(false);
        }
        return false;
    }

    public boolean isStudentOwner(Long studentId) {
        return studentRepository.findById(studentId)
                .map(student -> isOwner(student.getUser().getId()))
                .orElse(false);
    }

    public boolean isApplicantOwner(Long applicantId) {
        return applicantRepository.findById(applicantId)
                .map(applicant -> isOwner(applicant.getUser().getId()))
                .orElse(false);
    }

    public boolean isEmployeeOwner(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .map(employee -> isOwner(employee.getUser().getId()))
                .orElse(false);
    }

    public boolean isNotificationOwner(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .map(notification -> isOwner(notification.getUserId()))
                .orElse(false);
    }

    public boolean isPaymentOwner(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId)
                .map(payment -> isOwner(payment.getUser().getId()))
                .orElse(false);
    }

    public boolean isStudentOwnerByRegNo(String registrationNumber) {
        return studentRepository.findByRegistrationNumber(registrationNumber)
                .map(student -> isOwner(student.getUser().getId()))
                .orElse(false);
    }

    public boolean isEmailOwner(String email) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) return false;
        Object principal = authentication.getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.User springUser) {
            return springUser.getUsername().equals(email);
        }
        return false;
    }

    public boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) return false;
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }
}
