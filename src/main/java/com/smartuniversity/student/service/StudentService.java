package com.smartuniversity.student.service;

import com.smartuniversity.admission.entity.Applicant;
import com.smartuniversity.admission.repository.ApplicantRepository;
import com.smartuniversity.common.enums.AdmissionStatus;
import com.smartuniversity.common.exception.BadRequestException;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.student.dto.StudentResponse;
import com.smartuniversity.student.entity.Student;
import com.smartuniversity.student.mapper.StudentMapper;
import com.smartuniversity.student.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final ApplicantRepository applicantRepository;
    private final StudentMapper studentMapper;

    public StudentService(StudentRepository studentRepository, ApplicantRepository applicantRepository,
                          StudentMapper studentMapper) {
        this.studentRepository = studentRepository;
        this.applicantRepository = applicantRepository;
        this.studentMapper = studentMapper;
    }

    @Transactional
    public StudentResponse enroll(Long applicantId) {
        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", applicantId));

        if (applicant.getStatus() != AdmissionStatus.ADMITTED) {
            throw new BadRequestException("Applicant must be ADMITTED before enrollment. Current status: " + applicant.getStatus());
        }

        if (!applicant.isPaymentCompleted()) {
            throw new BadRequestException("Admission fee payment not completed");
        }

        if (studentRepository.findByApplicantId(applicantId).isPresent()) {
            throw new BadRequestException("Applicant is already enrolled as a student");
        }

        User user = applicant.getUser();

        Student student = Student.builder()
                .user(user)
                .applicant(applicant)
                .registrationNumber("REG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .firstName(applicant.getFirstName())
                .middleName(applicant.getMiddleName())
                .lastName(applicant.getLastName())
                .cgpa(0.0)
                .active(true)
                .build();
        student = studentRepository.save(student);
        return studentMapper.toResponse(student);
    }

    public StudentResponse getById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return studentMapper.toResponse(student);
    }

    public StudentResponse getByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "userId", userId));
        return studentMapper.toResponse(student);
    }

    public StudentResponse getByRegistrationNumber(String regNo) {
        Student student = studentRepository.findByRegistrationNumber(regNo)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "registrationNumber", regNo));
        return studentMapper.toResponse(student);
    }

    public Page<StudentResponse> getAll(Pageable pageable) {
        return studentRepository.findAll(pageable).map(studentMapper::toResponse);
    }

    @Transactional
    public StudentResponse updateProfile(Long id, com.smartuniversity.student.dto.StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        student.setFirstName(request.getFirstName());
        student.setMiddleName(request.getMiddleName());
        student.setLastName(request.getLastName());
        student = studentRepository.save(student);
        return studentMapper.toResponse(student);
    }

    @Transactional
    public void deactivate(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        student.setActive(false);
        studentRepository.save(student);
    }
}
