package com.smartuniversity.config;

import com.smartuniversity.academic.entity.AcademicSession;
import com.smartuniversity.academic.entity.Course;
import com.smartuniversity.academic.entity.CourseTeacher;
import com.smartuniversity.academic.entity.StudentResult;
import com.smartuniversity.academic.entity.YearLevel;
import com.smartuniversity.academic.entity.YearResult;
import com.smartuniversity.academic.repository.AcademicSessionRepository;
import com.smartuniversity.academic.repository.CourseRepository;
import com.smartuniversity.academic.repository.CourseTeacherRepository;
import com.smartuniversity.academic.repository.StudentResultRepository;
import com.smartuniversity.academic.repository.YearLevelRepository;
import com.smartuniversity.academic.repository.YearResultRepository;
import com.smartuniversity.admission.entity.AdmissionCircular;
import com.smartuniversity.admission.entity.AdmitCard;
import com.smartuniversity.admission.entity.Applicant;
import com.smartuniversity.admission.entity.ApplicantDocument;
import com.smartuniversity.admission.entity.Department;
import com.smartuniversity.admission.entity.DocumentType;
import com.smartuniversity.admission.entity.Faculty;
import com.smartuniversity.admission.entity.HscResult;
import com.smartuniversity.admission.entity.MeritList;
import com.smartuniversity.admission.entity.SscResult;
import com.smartuniversity.admission.repository.AdmissionCircularRepository;
import com.smartuniversity.admission.repository.AdmitCardRepository;
import com.smartuniversity.admission.repository.ApplicantDocumentRepository;
import com.smartuniversity.admission.repository.ApplicantRepository;
import com.smartuniversity.admission.repository.DepartmentRepository;
import com.smartuniversity.admission.repository.DocumentTypeRepository;
import com.smartuniversity.admission.repository.FacultyRepository;
import com.smartuniversity.admission.repository.HscResultRepository;
import com.smartuniversity.admission.repository.MeritListRepository;
import com.smartuniversity.admission.repository.SscResultRepository;
import com.smartuniversity.audit.entity.AuditLog;
import com.smartuniversity.audit.repository.AuditLogRepository;
import com.smartuniversity.common.enums.AdmissionStatus;
import com.smartuniversity.common.enums.AppraisalRating;
import com.smartuniversity.common.enums.ApprovalStatus;
import com.smartuniversity.common.enums.AttendanceStatus;
import com.smartuniversity.common.enums.EmployeeType;
import com.smartuniversity.common.enums.Gender;
import com.smartuniversity.common.enums.JobApplicationStatus;
import com.smartuniversity.common.enums.LeaveStatus;
import com.smartuniversity.common.enums.NotificationType;
import com.smartuniversity.common.enums.Permission;
import com.smartuniversity.common.enums.PaymentType;
import com.smartuniversity.common.enums.PromotionType;
import com.smartuniversity.common.enums.SeparationType;
import com.smartuniversity.hrm.entity.Appraisal;
import com.smartuniversity.hrm.entity.ApprovalStep;
import com.smartuniversity.hrm.entity.ApprovalWorkflow;
import com.smartuniversity.hrm.entity.Attendance;
import com.smartuniversity.hrm.entity.Designation;
import com.smartuniversity.hrm.entity.Employee;
import com.smartuniversity.hrm.entity.EmployeeFaceData;
import com.smartuniversity.hrm.entity.Grade;
import com.smartuniversity.hrm.entity.Interview;
import com.smartuniversity.hrm.entity.JobApplication;
import com.smartuniversity.hrm.entity.JobPosting;
import com.smartuniversity.hrm.entity.LeaveBalance;
import com.smartuniversity.hrm.entity.LeaveRequest;
import com.smartuniversity.hrm.entity.LeaveType;
import com.smartuniversity.hrm.entity.PromotionHistory;
import com.smartuniversity.hrm.entity.Separation;
import com.smartuniversity.hrm.repository.AppraisalRepository;
import com.smartuniversity.hrm.repository.ApprovalStepRepository;
import com.smartuniversity.hrm.repository.ApprovalWorkflowRepository;
import com.smartuniversity.hrm.repository.AttendanceRepository;
import com.smartuniversity.hrm.repository.DesignationRepository;
import com.smartuniversity.hrm.repository.EmployeeFaceDataRepository;
import com.smartuniversity.hrm.repository.EmployeeRepository;
import com.smartuniversity.hrm.repository.GradeRepository;
import com.smartuniversity.hrm.repository.InterviewRepository;
import com.smartuniversity.hrm.repository.JobApplicationRepository;
import com.smartuniversity.hrm.repository.JobPostingRepository;
import com.smartuniversity.hrm.repository.LeaveBalanceRepository;
import com.smartuniversity.hrm.repository.LeaveRequestRepository;
import com.smartuniversity.hrm.repository.LeaveTypeRepository;
import com.smartuniversity.hrm.repository.PromotionHistoryRepository;
import com.smartuniversity.hrm.repository.SeparationRepository;
import com.smartuniversity.notification.entity.NotificationEvent;
import com.smartuniversity.notification.repository.NotificationRepository;
import com.smartuniversity.payment.entity.Payment;
import com.smartuniversity.payment.repository.PaymentRepository;
import com.smartuniversity.payroll.entity.PayrollRun;
import com.smartuniversity.payroll.entity.Payslip;
import com.smartuniversity.payroll.entity.SalaryStructure;
import com.smartuniversity.payroll.repository.PayrollRunRepository;
import com.smartuniversity.payroll.repository.PayslipRepository;
import com.smartuniversity.payroll.repository.SalaryStructureRepository;
import com.smartuniversity.security.entity.Role;
import com.smartuniversity.security.entity.User;
import com.smartuniversity.security.repository.RoleRepository;
import com.smartuniversity.security.repository.UserRepository;
import com.smartuniversity.student.entity.Student;
import com.smartuniversity.student.entity.StudentAttendance;
import com.smartuniversity.student.entity.StudentFaceData;
import com.smartuniversity.student.repository.StudentAttendanceRepository;
import com.smartuniversity.student.repository.StudentFaceDataRepository;
import com.smartuniversity.student.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final AdmissionCircularRepository circularRepository;
    private final DesignationRepository designationRepository;
    private final GradeRepository gradeRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final AcademicSessionRepository sessionRepository;
    private final ApplicantRepository applicantRepository;
    private final ApplicantDocumentRepository applicantDocumentRepository;
    private final AdmitCardRepository admitCardRepository;
    private final MeritListRepository meritListRepository;
    private final SscResultRepository sscResultRepository;
    private final HscResultRepository hscResultRepository;
    private final StudentRepository studentRepository;
    private final StudentFaceDataRepository studentFaceDataRepository;
    private final StudentAttendanceRepository studentAttendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeFaceDataRepository employeeFaceDataRepository;
    private final AttendanceRepository attendanceRepository;
    private final YearLevelRepository yearLevelRepository;
    private final CourseRepository courseRepository;
    private final CourseTeacherRepository courseTeacherRepository;
    private final StudentResultRepository studentResultRepository;
    private final YearResultRepository yearResultRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final AppraisalRepository appraisalRepository;
    private final ApprovalWorkflowRepository approvalWorkflowRepository;
    private final ApprovalStepRepository approvalStepRepository;
    private final PromotionHistoryRepository promotionHistoryRepository;
    private final SeparationRepository separationRepository;
    private final JobPostingRepository jobPostingRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final InterviewRepository interviewRepository;
    private final SalaryStructureRepository salaryStructureRepository;
    private final PayrollRunRepository payrollRunRepository;
    private final PayslipRepository payslipRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository,
                           PasswordEncoder passwordEncoder, FacultyRepository facultyRepository,
                           DepartmentRepository departmentRepository,
                           AdmissionCircularRepository circularRepository,
                           DesignationRepository designationRepository,
                           GradeRepository gradeRepository,
                           DocumentTypeRepository documentTypeRepository,
                           AcademicSessionRepository sessionRepository,
                           ApplicantRepository applicantRepository,
                           ApplicantDocumentRepository applicantDocumentRepository,
                           AdmitCardRepository admitCardRepository,
                           MeritListRepository meritListRepository,
                           SscResultRepository sscResultRepository,
                           HscResultRepository hscResultRepository,
                           StudentRepository studentRepository,
                           StudentFaceDataRepository studentFaceDataRepository,
                           StudentAttendanceRepository studentAttendanceRepository,
                           EmployeeRepository employeeRepository,
                           EmployeeFaceDataRepository employeeFaceDataRepository,
                           AttendanceRepository attendanceRepository,
                           YearLevelRepository yearLevelRepository,
                           CourseRepository courseRepository,
                           CourseTeacherRepository courseTeacherRepository,
                           StudentResultRepository studentResultRepository,
                           YearResultRepository yearResultRepository,
                           LeaveTypeRepository leaveTypeRepository,
                           LeaveBalanceRepository leaveBalanceRepository,
                           LeaveRequestRepository leaveRequestRepository,
                           AppraisalRepository appraisalRepository,
                           ApprovalWorkflowRepository approvalWorkflowRepository,
                           ApprovalStepRepository approvalStepRepository,
                           PromotionHistoryRepository promotionHistoryRepository,
                           SeparationRepository separationRepository,
                           JobPostingRepository jobPostingRepository,
                           JobApplicationRepository jobApplicationRepository,
                           InterviewRepository interviewRepository,
                           SalaryStructureRepository salaryStructureRepository,
                           PayrollRunRepository payrollRunRepository,
                           PayslipRepository payslipRepository,
                           PaymentRepository paymentRepository,
                           NotificationRepository notificationRepository,
                           AuditLogRepository auditLogRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.facultyRepository = facultyRepository;
        this.departmentRepository = departmentRepository;
        this.circularRepository = circularRepository;
        this.designationRepository = designationRepository;
        this.gradeRepository = gradeRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.sessionRepository = sessionRepository;
        this.applicantRepository = applicantRepository;
        this.applicantDocumentRepository = applicantDocumentRepository;
        this.admitCardRepository = admitCardRepository;
        this.meritListRepository = meritListRepository;
        this.sscResultRepository = sscResultRepository;
        this.hscResultRepository = hscResultRepository;
        this.studentRepository = studentRepository;
        this.studentFaceDataRepository = studentFaceDataRepository;
        this.studentAttendanceRepository = studentAttendanceRepository;
        this.employeeRepository = employeeRepository;
        this.employeeFaceDataRepository = employeeFaceDataRepository;
        this.attendanceRepository = attendanceRepository;
        this.yearLevelRepository = yearLevelRepository;
        this.courseRepository = courseRepository;
        this.courseTeacherRepository = courseTeacherRepository;
        this.studentResultRepository = studentResultRepository;
        this.yearResultRepository = yearResultRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.appraisalRepository = appraisalRepository;
        this.approvalWorkflowRepository = approvalWorkflowRepository;
        this.approvalStepRepository = approvalStepRepository;
        this.promotionHistoryRepository = promotionHistoryRepository;
        this.separationRepository = separationRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.interviewRepository = interviewRepository;
        this.salaryStructureRepository = salaryStructureRepository;
        this.payrollRunRepository = payrollRunRepository;
        this.payslipRepository = payslipRepository;
        this.paymentRepository = paymentRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting database seeding...");
        seedRoles();
        seedUsers();
        seedFacultiesAndDepartments();
        seedDesignationsAndGrades();
        seedDocumentTypes();
        seedAdmissionCirculars();
        seedAcademicSession();
        seedApplicants();
        seedApplicantDocuments();
        seedSscResults();
        seedHscResults();
        seedAdmitCards();
        seedMeritLists();
        seedStudents();
        seedStudentFaceData();
        seedStudentAttendance();
        seedEmployees();
        seedEmployeeFaceData();
        seedEmployeeAttendance();
        seedYearLevels();
        seedCourses();
        seedCourseTeachers();
        seedStudentResults();
        seedYearResults();
        seedLeaveTypes();
        seedLeaveBalances();
        seedLeaveRequests();
        seedAppraisals();
        seedApprovalWorkflows();
        seedApprovalSteps();
        seedPromotionHistory();
        seedSeparations();
        seedJobPostings();
        seedJobApplications();
        seedInterviews();
        seedSalaryStructures();
        seedPayrollRuns();
        seedPayslips();
        seedPayments();
        seedNotifications();
        seedAuditLogs();
        log.info("Database seeding complete.");
    }

    private void seedRoles() {
        createRoleIfNotExists("ADMIN", "System Administrator", Set.of(Permission.values()));
        createRoleIfNotExists("STUDENT", "Student", Set.of(Permission.USER_READ));
        createRoleIfNotExists("EMPLOYEE", "University Employee", Set.of(Permission.USER_READ, Permission.HRM_READ));
        createRoleIfNotExists("FACULTY", "Faculty Member", Set.of(Permission.USER_READ, Permission.ACADEMIC_READ, Permission.ACADEMIC_WRITE));
        createRoleIfNotExists("HR", "Human Resources", Set.of(Permission.USER_READ, Permission.HRM_READ, Permission.HRM_WRITE, Permission.HRM_APPROVE));
        createRoleIfNotExists("PAYROLL", "Payroll Officer", Set.of(Permission.USER_READ, Permission.PAYROLL_READ, Permission.PAYROLL_WRITE));
        createRoleIfNotExists("ADMISSION", "Admission Officer", Set.of(Permission.USER_READ, Permission.ADMISSION_READ, Permission.ADMISSION_WRITE, Permission.ADMISSION_APPROVE));
        createRoleIfNotExists("APPLICANT", "Applicant", Set.of(Permission.USER_READ, Permission.ADMISSION_READ));
        createRoleIfNotExists("REGISTRAR", "University Registrar", Set.of(Permission.USER_READ, Permission.STUDENT_READ, Permission.STUDENT_WRITE, Permission.ACADEMIC_READ, Permission.ACADEMIC_WRITE));
        createRoleIfNotExists("SUPER_ADMIN", "Super Administrator", Set.of(Permission.values()));
    }

    private void seedUsers() {
        Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
        Role superAdminRole = roleRepository.findByName("SUPER_ADMIN").orElseThrow();
        Role hrRole = roleRepository.findByName("HR").orElseThrow();
        Role admissionRole = roleRepository.findByName("ADMISSION").orElseThrow();
        Role facultyRole = roleRepository.findByName("FACULTY").orElseThrow();
        Role studentRole = roleRepository.findByName("STUDENT").orElseThrow();
        Role applicantRole = roleRepository.findByName("APPLICANT").orElseThrow();
        Role employeeRole = roleRepository.findByName("EMPLOYEE").orElseThrow();

        createUserIfNotExists("admin@smartuniversity.edu", "admin123", Set.of(adminRole));
        createUserIfNotExists("superadmin@smartuniversity.edu", "admin123", Set.of(superAdminRole, adminRole));
        createUserIfNotExists("hr@smartuniversity.edu", "admin123", Set.of(hrRole));
        createUserIfNotExists("admission@smartuniversity.edu", "admin123", Set.of(admissionRole));

        createUserIfNotExists("prof.rahman@smartuniversity.edu", "admin123", Set.of(facultyRole, employeeRole));
        createUserIfNotExists("prof.kumar@smartuniversity.edu", "admin123", Set.of(facultyRole, employeeRole));
        createUserIfNotExists("prof.sultana@smartuniversity.edu", "admin123", Set.of(facultyRole, employeeRole));

        createUserIfNotExists("tanvir.ahmed@student.smartuniversity.edu", "admin123", Set.of(studentRole));
        createUserIfNotExists("fatema.khatun@student.smartuniversity.edu", "admin123", Set.of(studentRole));
        createUserIfNotExists("imran.hossain@student.smartuniversity.edu", "admin123", Set.of(studentRole));

        createUserIfNotExists("sarah.jahan@applicant.smartuniversity.edu", "admin123", Set.of(applicantRole));
        createUserIfNotExists("ali.hasan@applicant.smartuniversity.edu", "admin123", Set.of(applicantRole));
    }

    private void seedFacultiesAndDepartments() {
        if (facultyRepository.count() > 0) return;

        Faculty sciTech = Faculty.builder().name("Faculty of Science & Technology").code("FST").description("Science and technology programs").active(true).build();
        Faculty business = Faculty.builder().name("Faculty of Business & Economics").code("FBE").description("Business and economics programs").active(true).build();
        Faculty arts = Faculty.builder().name("Faculty of Arts & Humanities").code("FAH").description("Arts and humanities programs").active(true).build();
        Faculty medicine = Faculty.builder().name("Faculty of Medicine").code("FMD").description("Medical and health science programs").active(true).build();

        sciTech = facultyRepository.save(sciTech);
        business = facultyRepository.save(business);
        arts = facultyRepository.save(arts);
        medicine = facultyRepository.save(medicine);

        departmentRepository.save(Department.builder().name("Computer Science & Engineering").code("CSE").faculty(sciTech).active(true).build());
        departmentRepository.save(Department.builder().name("Electrical & Electronic Engineering").code("EEE").faculty(sciTech).active(true).build());
        departmentRepository.save(Department.builder().name("Mathematics & Physics").code("MPH").faculty(sciTech).active(true).build());
        departmentRepository.save(Department.builder().name("Business Administration").code("BBA").faculty(business).active(true).build());
        departmentRepository.save(Department.builder().name("Accounting & Finance").code("ACF").faculty(business).active(true).build());
        departmentRepository.save(Department.builder().name("Economics").code("ECO").faculty(business).active(true).build());
        departmentRepository.save(Department.builder().name("English Literature").code("ENL").faculty(arts).active(true).build());
        departmentRepository.save(Department.builder().name("Bangla").code("BAN").faculty(arts).active(true).build());
        departmentRepository.save(Department.builder().name("History & Civilization").code("HIS").faculty(arts).active(true).build());
        departmentRepository.save(Department.builder().name("Medicine & Surgery").code("MED").faculty(medicine).active(true).build());
        departmentRepository.save(Department.builder().name("Pharmacy").code("PHR").faculty(medicine).active(true).build());

        log.info("Seeded {} faculties and their departments.", 4);
    }

    private void seedDesignationsAndGrades() {
        if (designationRepository.count() > 0) return;

        designationRepository.save(Designation.builder().name("Professor").description("Full Professor").level(1).active(true).build());
        designationRepository.save(Designation.builder().name("Associate Professor").description("Associate Professor").level(2).active(true).build());
        designationRepository.save(Designation.builder().name("Assistant Professor").description("Assistant Professor").level(3).active(true).build());
        designationRepository.save(Designation.builder().name("Lecturer").description("Lecturer").level(4).active(true).build());
        designationRepository.save(Designation.builder().name("Senior Lecturer").description("Senior Lecturer").level(3).active(true).build());
        designationRepository.save(Designation.builder().name("Director").description("Director").level(1).active(true).build());
        designationRepository.save(Designation.builder().name("Officer").description("Officer").level(5).active(true).build());
        designationRepository.save(Designation.builder().name("Assistant Officer").description("Assistant Officer").level(6).active(true).build());
        designationRepository.save(Designation.builder().name("Admin Assistant").description("Administrative Assistant").level(7).active(true).build());

        gradeRepository.save(Grade.builder().name("G1").basicSalary(new BigDecimal("80000")).houseAllowance(new BigDecimal("16000")).medicalAllowance(new BigDecimal("5000")).transportAllowance(new BigDecimal("5000")).active(true).build());
        gradeRepository.save(Grade.builder().name("G2").basicSalary(new BigDecimal("60000")).houseAllowance(new BigDecimal("12000")).medicalAllowance(new BigDecimal("4000")).transportAllowance(new BigDecimal("4000")).active(true).build());
        gradeRepository.save(Grade.builder().name("G3").basicSalary(new BigDecimal("45000")).houseAllowance(new BigDecimal("9000")).medicalAllowance(new BigDecimal("3000")).transportAllowance(new BigDecimal("3000")).active(true).build());
        gradeRepository.save(Grade.builder().name("G4").basicSalary(new BigDecimal("35000")).houseAllowance(new BigDecimal("7000")).medicalAllowance(new BigDecimal("2500")).transportAllowance(new BigDecimal("2500")).active(true).build());
        gradeRepository.save(Grade.builder().name("G5").basicSalary(new BigDecimal("25000")).houseAllowance(new BigDecimal("5000")).medicalAllowance(new BigDecimal("2000")).transportAllowance(new BigDecimal("2000")).active(true).build());

        log.info("Seeded {} designations and {} grades.", 9, 5);
    }

    private void seedDocumentTypes() {
        if (documentTypeRepository.count() > 0) return;

        documentTypeRepository.save(DocumentType.builder().name("SSC Certificate").description("Secondary School Certificate").required(true).allowedFormats("pdf,jpg,png").active(true).build());
        documentTypeRepository.save(DocumentType.builder().name("HSC Certificate").description("Higher Secondary Certificate").required(true).allowedFormats("pdf,jpg,png").active(true).build());
        documentTypeRepository.save(DocumentType.builder().name("Transcript").description("Academic transcript").required(false).allowedFormats("pdf").active(true).build());
        documentTypeRepository.save(DocumentType.builder().name("National ID").description("National ID card copy").required(false).allowedFormats("pdf,jpg,png").active(true).build());
        documentTypeRepository.save(DocumentType.builder().name("Photo").description("Passport size photograph").required(true).allowedFormats("jpg,png").active(true).build());

        log.info("Seeded {} document types.", 5);
    }

    private void seedAdmissionCirculars() {
        if (circularRepository.count() > 0) return;

        Faculty sciTech = facultyRepository.findByCode("FST").orElse(null);
        Faculty business = facultyRepository.findByCode("FBE").orElse(null);

        if (sciTech != null) {
            circularRepository.save(AdmissionCircular.builder()
                    .title("Spring 2026 Admission — Science & Technology")
                    .session("Spring 2026")
                    .faculty(sciTech)
                    .registrationStartDate(LocalDate.of(2026, 1, 1))
                    .registrationEndDate(LocalDate.of(2026, 12, 31))
                    .applicationFee(new BigDecimal("1500"))
                    .totalSeats(120)
                    .active(true)
                    .build());
        }

        if (business != null) {
            circularRepository.save(AdmissionCircular.builder()
                    .title("Spring 2026 Admission — Business & Economics")
                    .session("Spring 2026")
                    .faculty(business)
                    .registrationStartDate(LocalDate.of(2026, 1, 1))
                    .registrationEndDate(LocalDate.of(2026, 12, 31))
                    .applicationFee(new BigDecimal("1500"))
                    .totalSeats(100)
                    .active(true)
                    .build());
        }

        if (sciTech != null) {
            circularRepository.save(AdmissionCircular.builder()
                    .title("Summer 2026 Admission — Science & Technology")
                    .session("Summer 2026")
                    .faculty(sciTech)
                    .registrationStartDate(LocalDate.of(2026, 5, 1))
                    .registrationEndDate(LocalDate.of(2026, 12, 31))
                    .applicationFee(new BigDecimal("1500"))
                    .totalSeats(80)
                    .active(true)
                    .build());
        }

        log.info("Seeded {} admission circulars.", 3);
    }

    private void seedAcademicSession() {
        if (sessionRepository.count() > 0) return;

        sessionRepository.save(AcademicSession.builder()
                .name("Spring 2026")
                .startYear(2026)
                .endYear(2026)
                .active(true)
                .build());

        log.info("Seeded academic session: Spring 2026");
    }

    private void seedApplicants() {
        if (applicantRepository.count() > 0) return;

        Role applicantRole = roleRepository.findByName("APPLICANT").orElseThrow();
        User tanvirUser = createUserIfNotExists("tanvir.ahmed@applicant.smartuniversity.edu", "admin123", Set.of(applicantRole));
        User fatemaUser = createUserIfNotExists("fatema.khatun@applicant.smartuniversity.edu", "admin123", Set.of(applicantRole));
        User sarahUser = createUserIfNotExists("sarah.jahan@applicant.smartuniversity.edu", "admin123", Set.of(applicantRole));
        User aliUser = createUserIfNotExists("ali.hasan@applicant.smartuniversity.edu", "admin123", Set.of(applicantRole));

        AdmissionCircular springST = circularRepository.findBySessionAndActiveTrue("Spring 2026").stream()
                .filter(c -> c.getFaculty().getCode().equals("FST")).findFirst().orElse(null);
        AdmissionCircular springBiz = circularRepository.findBySessionAndActiveTrue("Spring 2026").stream()
                .filter(c -> c.getFaculty().getCode().equals("FBE")).findFirst().orElse(null);
        AdmissionCircular summerST = circularRepository.findBySessionAndActiveTrue("Summer 2026").stream()
                .filter(c -> c.getFaculty().getCode().equals("FST")).findFirst().orElse(null);

        Department cse = departmentRepository.findByFacultyId(springST.getFaculty().getId()).stream()
                .filter(d -> d.getCode().equals("CSE")).findFirst().orElse(null);
        Department bba = departmentRepository.findByFacultyId(springBiz.getFaculty().getId()).stream()
                .filter(d -> d.getCode().equals("BBA")).findFirst().orElse(null);
        Department eee = departmentRepository.findByFacultyId(springST.getFaculty().getId()).stream()
                .filter(d -> d.getCode().equals("EEE")).findFirst().orElse(null);

        applicantRepository.save(Applicant.builder()
                .user(tanvirUser).firstName("Tanvir").lastName("Ahmed").phone("01712345678")
                .gender(Gender.MALE).dateOfBirth(LocalDate.of(2004, 5, 15))
                .address("Dhaka, Bangladesh").circular(springST).preferredDepartment(cse)
                .status(AdmissionStatus.ADMITTED).emailVerified(true).paymentCompleted(true)
                .applicationNumber("APP-2026-001").meritScore(85.5).build());

        applicantRepository.save(Applicant.builder()
                .user(fatemaUser).firstName("Fatema").lastName("Khatun").phone("01812345679")
                .gender(Gender.FEMALE).dateOfBirth(LocalDate.of(2004, 8, 22))
                .address("Chittagong, Bangladesh").circular(springBiz).preferredDepartment(bba)
                .status(AdmissionStatus.ADMITTED).emailVerified(true).paymentCompleted(true)
                .applicationNumber("APP-2026-002").meritScore(82.3).build());

        applicantRepository.save(Applicant.builder()
                .user(sarahUser).firstName("Sarah").lastName("Jahan").phone("01912345680")
                .gender(Gender.FEMALE).dateOfBirth(LocalDate.of(2004, 3, 10))
                .address("Rajshahi, Bangladesh").circular(summerST).preferredDepartment(eee)
                .status(AdmissionStatus.REGISTRATION_OPEN).emailVerified(true).paymentCompleted(false)
                .applicationNumber("APP-2026-003").meritScore(78.9).build());

        applicantRepository.save(Applicant.builder()
                .user(aliUser).firstName("Ali").lastName("Hasan").phone("01612345681")
                .gender(Gender.MALE).dateOfBirth(LocalDate.of(2004, 11, 5))
                .address("Sylhet, Bangladesh").circular(summerST).preferredDepartment(cse)
                .status(AdmissionStatus.REGISTRATION_OPEN).emailVerified(false).paymentCompleted(false)
                .applicationNumber("APP-2026-004").meritScore(75.2).build());

        log.info("Seeded {} applicants.", 4);
    }

    private void seedApplicantDocuments() {
        if (applicantDocumentRepository.count() > 0) return;

        Applicant tanvir = applicantRepository.findByApplicationNumber("APP-2026-001").orElse(null);
        Applicant fatema = applicantRepository.findByApplicationNumber("APP-2026-002").orElse(null);

        if (tanvir != null) {
            applicantDocumentRepository.save(ApplicantDocument.builder().applicant(tanvir).documentType("SSC Certificate").fileName("tanvir_ssc.pdf").fileUrl("/uploads/docs/tanvir_ssc.pdf").verified(true).build());
            applicantDocumentRepository.save(ApplicantDocument.builder().applicant(tanvir).documentType("HSC Certificate").fileName("tanvir_hsc.pdf").fileUrl("/uploads/docs/tanvir_hsc.pdf").verified(true).build());
            applicantDocumentRepository.save(ApplicantDocument.builder().applicant(tanvir).documentType("Photo").fileName("tanvir_photo.jpg").fileUrl("/uploads/docs/tanvir_photo.jpg").verified(true).build());
        }

        if (fatema != null) {
            applicantDocumentRepository.save(ApplicantDocument.builder().applicant(fatema).documentType("SSC Certificate").fileName("fatema_ssc.pdf").fileUrl("/uploads/docs/fatema_ssc.pdf").verified(true).build());
            applicantDocumentRepository.save(ApplicantDocument.builder().applicant(fatema).documentType("HSC Certificate").fileName("fatema_hsc.pdf").fileUrl("/uploads/docs/fatema_hsc.pdf").verified(true).build());
            applicantDocumentRepository.save(ApplicantDocument.builder().applicant(fatema).documentType("Photo").fileName("fatema_photo.jpg").fileUrl("/uploads/docs/fatema_photo.jpg").verified(true).build());
        }

        log.info("Seeded {} applicant documents.", 6);
    }

    private void seedSscResults() {
        if (sscResultRepository.count() > 0) return;

        Applicant tanvir = applicantRepository.findByApplicationNumber("APP-2026-001").orElse(null);
        Applicant fatema = applicantRepository.findByApplicationNumber("APP-2026-002").orElse(null);
        Applicant sarah = applicantRepository.findByApplicationNumber("APP-2026-003").orElse(null);

        if (tanvir != null) {
            sscResultRepository.save(SscResult.builder().applicant(tanvir).board("Dhaka").examYear(2022).rollNumber("123456").registrationNumber("REG-SSC-001").studentGroup("Science").institution("Ideal School & College").gpa(5.00).scienceGpa(5.00).mathGpa(5.00).verified(true).build());
        }
        if (fatema != null) {
            sscResultRepository.save(SscResult.builder().applicant(fatema).board("Chittagong").examYear(2022).rollNumber("234567").registrationNumber("REG-SSC-002").studentGroup("Business Studies").institution("Chittagong Collegiate School").gpa(4.88).verified(true).build());
        }
        if (sarah != null) {
            sscResultRepository.save(SscResult.builder().applicant(sarah).board("Rajshahi").examYear(2022).rollNumber("345678").registrationNumber("REG-SSC-003").studentGroup("Science").institution("Rajshahi Collegiate School").gpa(4.75).scienceGpa(4.80).mathGpa(4.70).verified(true).build());
        }

        log.info("Seeded {} SSC results.", 3);
    }

    private void seedHscResults() {
        if (hscResultRepository.count() > 0) return;

        Applicant tanvir = applicantRepository.findByApplicationNumber("APP-2026-001").orElse(null);
        Applicant fatema = applicantRepository.findByApplicationNumber("APP-2026-002").orElse(null);
        Applicant sarah = applicantRepository.findByApplicationNumber("APP-2026-003").orElse(null);

        if (tanvir != null) {
            hscResultRepository.save(HscResult.builder().applicant(tanvir).board("Dhaka").examYear(2024).rollNumber("654321").registrationNumber("REG-HSC-001").studentGroup("Science").institution("Dhaka College").gpa(5.00).scienceGpa(5.00).mathGpa(5.00).verified(true).build());
        }
        if (fatema != null) {
            hscResultRepository.save(HscResult.builder().applicant(fatema).board("Chittagong").examYear(2024).rollNumber("765432").registrationNumber("REG-HSC-002").studentGroup("Business Studies").institution("Chittagong College").gpa(4.92).verified(true).build());
        }
        if (sarah != null) {
            hscResultRepository.save(HscResult.builder().applicant(sarah).board("Rajshahi").examYear(2024).rollNumber("876543").registrationNumber("REG-HSC-003").studentGroup("Science").institution("Rajshahi College").gpa(4.80).scienceGpa(4.85).mathGpa(4.75).verified(true).build());
        }

        log.info("Seeded {} HSC results.", 3);
    }

    private void seedAdmitCards() {
        if (admitCardRepository.count() > 0) return;

        Applicant tanvir = applicantRepository.findByApplicationNumber("APP-2026-001").orElse(null);
        Applicant fatema = applicantRepository.findByApplicationNumber("APP-2026-002").orElse(null);

        if (tanvir != null) {
            admitCardRepository.save(AdmitCard.builder().applicant(tanvir).admitCardNumber("ADM-2026-001").examDate(LocalDateTime.of(2026, 3, 15, 9, 0)).examCenter("Dhaka University Campus").downloaded(true).build());
        }
        if (fatema != null) {
            admitCardRepository.save(AdmitCard.builder().applicant(fatema).admitCardNumber("ADM-2026-002").examDate(LocalDateTime.of(2026, 3, 15, 9, 0)).examCenter("Chittagong University Campus").downloaded(false).build());
        }

        log.info("Seeded {} admit cards.", 2);
    }

    private void seedMeritLists() {
        if (meritListRepository.count() > 0) return;

        Applicant tanvir = applicantRepository.findByApplicationNumber("APP-2026-001").orElse(null);
        Applicant fatema = applicantRepository.findByApplicationNumber("APP-2026-002").orElse(null);

        AdmissionCircular springST = circularRepository.findBySessionAndActiveTrue("Spring 2026").stream()
                .filter(c -> c.getFaculty().getCode().equals("FST")).findFirst().orElse(null);
        AdmissionCircular springBiz = circularRepository.findBySessionAndActiveTrue("Spring 2026").stream()
                .filter(c -> c.getFaculty().getCode().equals("FBE")).findFirst().orElse(null);

        Department cse = departmentRepository.findByFacultyId(springST.getFaculty().getId()).stream()
                .filter(d -> d.getCode().equals("CSE")).findFirst().orElse(null);
        Department bba = departmentRepository.findByFacultyId(springBiz.getFaculty().getId()).stream()
                .filter(d -> d.getCode().equals("BBA")).findFirst().orElse(null);

        if (tanvir != null && cse != null) {
            meritListRepository.save(MeritList.builder().circular(springST).department(cse).applicant(tanvir).meritScore(85.5).meritPosition(1).published(true).publishedAt(LocalDateTime.now()).build());
        }
        if (fatema != null && bba != null) {
            meritListRepository.save(MeritList.builder().circular(springBiz).department(bba).applicant(fatema).meritScore(82.3).meritPosition(1).published(true).publishedAt(LocalDateTime.now()).build());
        }

        log.info("Seeded {} merit list entries.", 2);
    }

    private void seedStudents() {
        if (studentRepository.count() > 0) return;

        Role studentRole = roleRepository.findByName("STUDENT").orElseThrow();
        User tanvirUser = userRepository.findByEmail("tanvir.ahmed@student.smartuniversity.edu").orElse(null);
        User fatemaUser = userRepository.findByEmail("fatema.khatun@student.smartuniversity.edu").orElse(null);
        User imranUser = createUserIfNotExists("imran.hossain@student.smartuniversity.edu", "admin123", Set.of(studentRole));

        Applicant tanvir = applicantRepository.findByApplicationNumber("APP-2026-001").orElse(null);
        Applicant fatema = applicantRepository.findByApplicationNumber("APP-2026-002").orElse(null);

        if (tanvirUser != null) {
            studentRepository.save(Student.builder().user(tanvirUser).applicant(tanvir).registrationNumber("REG-2026-001").firstName("Tanvir").lastName("Ahmed").cgpa(3.75).active(true).build());
        }
        if (fatemaUser != null) {
            studentRepository.save(Student.builder().user(fatemaUser).applicant(fatema).registrationNumber("REG-2026-002").firstName("Fatema").lastName("Khatun").cgpa(3.60).active(true).build());
        }
        if (imranUser != null) {
            studentRepository.save(Student.builder().user(imranUser).registrationNumber("REG-2026-003").firstName("Imran").lastName("Hossain").cgpa(3.45).active(true).build());
        }

        log.info("Seeded {} students.", 3);
    }

    private void seedStudentFaceData() {
        if (studentFaceDataRepository.count() > 0) return;

        Student tanvir = studentRepository.findByRegistrationNumber("REG-2026-001").orElse(null);
        Student fatema = studentRepository.findByRegistrationNumber("REG-2026-002").orElse(null);

        if (tanvir != null) {
            studentFaceDataRepository.save(StudentFaceData.builder().student(tanvir).faceEncoding(new byte[128]).enrolledAt(LocalDateTime.now().minusDays(30)).build());
        }
        if (fatema != null) {
            studentFaceDataRepository.save(StudentFaceData.builder().student(fatema).faceEncoding(new byte[128]).enrolledAt(LocalDateTime.now().minusDays(25)).build());
        }

        log.info("Seeded {} student face data records.", 2);
    }

    private void seedStudentAttendance() {
        if (studentAttendanceRepository.count() > 0) return;

        Student tanvir = studentRepository.findByRegistrationNumber("REG-2026-001").orElse(null);
        Student fatema = studentRepository.findByRegistrationNumber("REG-2026-002").orElse(null);

        if (tanvir != null) {
            studentAttendanceRepository.save(StudentAttendance.builder().student(tanvir).date(LocalDate.now().minusDays(5)).checkInTime(LocalTime.of(8, 55)).checkOutTime(LocalTime.of(16, 5)).status(AttendanceStatus.PRESENT).build());
            studentAttendanceRepository.save(StudentAttendance.builder().student(tanvir).date(LocalDate.now().minusDays(4)).checkInTime(LocalTime.of(9, 10)).checkOutTime(LocalTime.of(16, 0)).status(AttendanceStatus.LATE).build());
            studentAttendanceRepository.save(StudentAttendance.builder().student(tanvir).date(LocalDate.now().minusDays(3)).checkInTime(LocalTime.of(8, 50)).checkOutTime(LocalTime.of(16, 10)).status(AttendanceStatus.PRESENT).build());
        }
        if (fatema != null) {
            studentAttendanceRepository.save(StudentAttendance.builder().student(fatema).date(LocalDate.now().minusDays(5)).checkInTime(LocalTime.of(8, 58)).checkOutTime(LocalTime.of(16, 2)).status(AttendanceStatus.PRESENT).build());
            studentAttendanceRepository.save(StudentAttendance.builder().student(fatema).date(LocalDate.now().minusDays(4)).status(AttendanceStatus.ABSENT).build());
            studentAttendanceRepository.save(StudentAttendance.builder().student(fatema).date(LocalDate.now().minusDays(3)).checkInTime(LocalTime.of(8, 55)).checkOutTime(LocalTime.of(16, 8)).status(AttendanceStatus.PRESENT).build());
        }

        log.info("Seeded {} student attendance records.", 6);
    }

    private void seedEmployees() {
        if (employeeRepository.count() > 0) return;

        User profRahman = userRepository.findByEmail("prof.rahman@smartuniversity.edu").orElse(null);
        User profKumar = userRepository.findByEmail("prof.kumar@smartuniversity.edu").orElse(null);
        User profSultana = userRepository.findByEmail("prof.sultana@smartuniversity.edu").orElse(null);

        Designation prof = designationRepository.findAll().stream().filter(d -> d.getName().equals("Professor")).findFirst().orElse(null);
        Designation assocProf = designationRepository.findAll().stream().filter(d -> d.getName().equals("Associate Professor")).findFirst().orElse(null);
        Designation asstProf = designationRepository.findAll().stream().filter(d -> d.getName().equals("Assistant Professor")).findFirst().orElse(null);

        Grade g1 = gradeRepository.findAll().stream().filter(g -> g.getName().equals("G1")).findFirst().orElse(null);
        Grade g2 = gradeRepository.findAll().stream().filter(g -> g.getName().equals("G2")).findFirst().orElse(null);
        Grade g3 = gradeRepository.findAll().stream().filter(g -> g.getName().equals("G3")).findFirst().orElse(null);

        if (profRahman != null) {
            employeeRepository.save(Employee.builder().user(profRahman).employeeId("EMP-001").firstName("Abdul").middleName("Rahman").lastName("Khan").phone("01711111111").gender(Gender.MALE).dateOfBirth(LocalDate.of(1975, 3, 20)).employeeType(EmployeeType.ACADEMIC).designation(prof).grade(g1).department("Computer Science & Engineering").active(true).build());
        }
        if (profKumar != null) {
            employeeRepository.save(Employee.builder().user(profKumar).employeeId("EMP-002").firstName("Rajesh").lastName("Kumar").phone("01722222222").gender(Gender.MALE).dateOfBirth(LocalDate.of(1980, 7, 15)).employeeType(EmployeeType.ACADEMIC).designation(assocProf).grade(g2).department("Electrical & Electronic Engineering").active(true).build());
        }
        if (profSultana != null) {
            employeeRepository.save(Employee.builder().user(profSultana).employeeId("EMP-003").firstName("Nasreen").lastName("Sultana").phone("01733333333").gender(Gender.FEMALE).dateOfBirth(LocalDate.of(1985, 11, 8)).employeeType(EmployeeType.ACADEMIC).designation(asstProf).grade(g3).department("Business Administration").active(true).build());
        }

        log.info("Seeded {} employees.", 3);
    }

    private void seedEmployeeFaceData() {
        if (employeeFaceDataRepository.count() > 0) return;

        Employee emp1 = employeeRepository.findByEmployeeId("EMP-001").orElse(null);
        Employee emp2 = employeeRepository.findByEmployeeId("EMP-002").orElse(null);

        if (emp1 != null) {
            employeeFaceDataRepository.save(EmployeeFaceData.builder().employee(emp1).faceEncoding(new byte[128]).enrolledAt(LocalDateTime.now().minusDays(60)).build());
        }
        if (emp2 != null) {
            employeeFaceDataRepository.save(EmployeeFaceData.builder().employee(emp2).faceEncoding(new byte[128]).enrolledAt(LocalDateTime.now().minusDays(45)).build());
        }

        log.info("Seeded {} employee face data records.", 2);
    }

    private void seedEmployeeAttendance() {
        if (attendanceRepository.count() > 0) return;

        Employee emp1 = employeeRepository.findByEmployeeId("EMP-001").orElse(null);
        Employee emp2 = employeeRepository.findByEmployeeId("EMP-002").orElse(null);

        if (emp1 != null) {
            attendanceRepository.save(Attendance.builder().employee(emp1).date(LocalDate.now().minusDays(5)).checkInTime(LocalTime.of(8, 30)).checkOutTime(LocalTime.of(17, 0)).status(AttendanceStatus.PRESENT).build());
            attendanceRepository.save(Attendance.builder().employee(emp1).date(LocalDate.now().minusDays(4)).checkInTime(LocalTime.of(8, 25)).checkOutTime(LocalTime.of(17, 5)).status(AttendanceStatus.PRESENT).build());
            attendanceRepository.save(Attendance.builder().employee(emp1).date(LocalDate.now().minusDays(3)).checkInTime(LocalTime.of(9, 0)).checkOutTime(LocalTime.of(17, 0)).status(AttendanceStatus.LATE).build());
        }
        if (emp2 != null) {
            attendanceRepository.save(Attendance.builder().employee(emp2).date(LocalDate.now().minusDays(5)).checkInTime(LocalTime.of(8, 35)).checkOutTime(LocalTime.of(16, 55)).status(AttendanceStatus.PRESENT).build());
            attendanceRepository.save(Attendance.builder().employee(emp2).date(LocalDate.now().minusDays(4)).status(AttendanceStatus.ON_LEAVE).build());
            attendanceRepository.save(Attendance.builder().employee(emp2).date(LocalDate.now().minusDays(3)).checkInTime(LocalTime.of(8, 40)).checkOutTime(LocalTime.of(17, 10)).status(AttendanceStatus.PRESENT).build());
        }

        log.info("Seeded {} employee attendance records.", 6);
    }

    private void seedYearLevels() {
        if (yearLevelRepository.count() > 0) return;

        Department cse = departmentRepository.findByFacultyId(facultyRepository.findByCode("FST").orElseThrow().getId()).stream()
                .filter(d -> d.getCode().equals("CSE")).findFirst().orElse(null);
        Department bba = departmentRepository.findByFacultyId(facultyRepository.findByCode("FBE").orElseThrow().getId()).stream()
                .filter(d -> d.getCode().equals("BBA")).findFirst().orElse(null);

        if (cse != null) {
            yearLevelRepository.save(YearLevel.builder().yearNumber(1).name("1st Year CSE").department(cse).build());
            yearLevelRepository.save(YearLevel.builder().yearNumber(2).name("2nd Year CSE").department(cse).build());
        }
        if (bba != null) {
            yearLevelRepository.save(YearLevel.builder().yearNumber(1).name("1st Year BBA").department(bba).build());
        }

        log.info("Seeded {} year levels.", 3);
    }

    private void seedCourses() {
        if (courseRepository.count() > 0) return;

        YearLevel y1Cse = yearLevelRepository.findByDepartmentIdOrderByYearNumber(departmentRepository.findByFacultyId(facultyRepository.findByCode("FST").orElseThrow().getId()).stream()
                .filter(d -> d.getCode().equals("CSE")).findFirst().orElseThrow().getId()).stream()
                .filter(yl -> yl.getYearNumber() == 1).findFirst().orElse(null);
        YearLevel y1Bba = yearLevelRepository.findByDepartmentIdOrderByYearNumber(departmentRepository.findByFacultyId(facultyRepository.findByCode("FBE").orElseThrow().getId()).stream()
                .filter(d -> d.getCode().equals("BBA")).findFirst().orElseThrow().getId()).stream()
                .filter(yl -> yl.getYearNumber() == 1).findFirst().orElse(null);

        if (y1Cse != null) {
            courseRepository.save(Course.builder().courseCode("CSE101").name("Introduction to Programming").creditHours(3.0).yearLevel(y1Cse).active(true).build());
            courseRepository.save(Course.builder().courseCode("CSE102").name("Data Structures").creditHours(3.0).yearLevel(y1Cse).active(true).build());
            courseRepository.save(Course.builder().courseCode("MAT101").name("Calculus I").creditHours(3.0).yearLevel(y1Cse).active(true).build());
        }
        if (y1Bba != null) {
            courseRepository.save(Course.builder().courseCode("BBA101").name("Principles of Management").creditHours(3.0).yearLevel(y1Bba).active(true).build());
            courseRepository.save(Course.builder().courseCode("BBA102").name("Financial Accounting").creditHours(3.0).yearLevel(y1Bba).active(true).build());
        }

        log.info("Seeded {} courses.", 5);
    }

    private void seedCourseTeachers() {
        if (courseTeacherRepository.count() > 0) return;

        AcademicSession spring2026 = sessionRepository.findByActiveTrue().orElse(null);
        Employee emp1 = employeeRepository.findByEmployeeId("EMP-001").orElse(null);
        Employee emp2 = employeeRepository.findByEmployeeId("EMP-002").orElse(null);
        Employee emp3 = employeeRepository.findByEmployeeId("EMP-003").orElse(null);

        Course cse101 = courseRepository.findByCourseCode("CSE101").orElse(null);
        Course cse102 = courseRepository.findByCourseCode("CSE102").orElse(null);
        Course mat101 = courseRepository.findByCourseCode("MAT101").orElse(null);
        Course bba101 = courseRepository.findByCourseCode("BBA101").orElse(null);
        Course bba102 = courseRepository.findByCourseCode("BBA102").orElse(null);

        if (cse101 != null && emp1 != null && spring2026 != null) {
            courseTeacherRepository.save(CourseTeacher.builder().course(cse101).employee(emp1).academicSession(spring2026).build());
        }
        if (cse102 != null && emp1 != null && spring2026 != null) {
            courseTeacherRepository.save(CourseTeacher.builder().course(cse102).employee(emp1).academicSession(spring2026).build());
        }
        if (mat101 != null && emp2 != null && spring2026 != null) {
            courseTeacherRepository.save(CourseTeacher.builder().course(mat101).employee(emp2).academicSession(spring2026).build());
        }
        if (bba101 != null && emp3 != null && spring2026 != null) {
            courseTeacherRepository.save(CourseTeacher.builder().course(bba101).employee(emp3).academicSession(spring2026).build());
        }
        if (bba102 != null && emp3 != null && spring2026 != null) {
            courseTeacherRepository.save(CourseTeacher.builder().course(bba102).employee(emp3).academicSession(spring2026).build());
        }

        log.info("Seeded {} course teacher assignments.", 5);
    }

    private void seedStudentResults() {
        if (studentResultRepository.count() > 0) return;

        AcademicSession spring2026 = sessionRepository.findByActiveTrue().orElse(null);
        Student tanvir = studentRepository.findByRegistrationNumber("REG-2026-001").orElse(null);
        Student fatema = studentRepository.findByRegistrationNumber("REG-2026-002").orElse(null);

        Course cse101 = courseRepository.findByCourseCode("CSE101").orElse(null);
        Course cse102 = courseRepository.findByCourseCode("CSE102").orElse(null);
        Course mat101 = courseRepository.findByCourseCode("MAT101").orElse(null);
        Course bba101 = courseRepository.findByCourseCode("BBA101").orElse(null);
        Course bba102 = courseRepository.findByCourseCode("BBA102").orElse(null);

        if (tanvir != null && cse101 != null && spring2026 != null) {
            studentResultRepository.save(StudentResult.builder().student(tanvir).course(cse101).academicSession(spring2026).gradePoint(3.75).creditHours(3.0).letterGrade("A-").published(true).build());
        }
        if (tanvir != null && cse102 != null && spring2026 != null) {
            studentResultRepository.save(StudentResult.builder().student(tanvir).course(cse102).academicSession(spring2026).gradePoint(3.50).creditHours(3.0).letterGrade("B+").published(true).build());
        }
        if (tanvir != null && mat101 != null && spring2026 != null) {
            studentResultRepository.save(StudentResult.builder().student(tanvir).course(mat101).academicSession(spring2026).gradePoint(4.00).creditHours(3.0).letterGrade("A").published(true).build());
        }
        if (fatema != null && bba101 != null && spring2026 != null) {
            studentResultRepository.save(StudentResult.builder().student(fatema).course(bba101).academicSession(spring2026).gradePoint(3.60).creditHours(3.0).letterGrade("A-").published(true).build());
        }
        if (fatema != null && bba102 != null && spring2026 != null) {
            studentResultRepository.save(StudentResult.builder().student(fatema).course(bba102).academicSession(spring2026).gradePoint(3.25).creditHours(3.0).letterGrade("B+").published(true).build());
        }

        log.info("Seeded {} student results.", 5);
    }

    private void seedYearResults() {
        if (yearResultRepository.count() > 0) return;

        AcademicSession spring2026 = sessionRepository.findByActiveTrue().orElse(null);
        Student tanvir = studentRepository.findByRegistrationNumber("REG-2026-001").orElse(null);
        Student fatema = studentRepository.findByRegistrationNumber("REG-2026-002").orElse(null);

        YearLevel y1Cse = yearLevelRepository.findByDepartmentIdOrderByYearNumber(departmentRepository.findByFacultyId(facultyRepository.findByCode("FST").orElseThrow().getId()).stream()
                .filter(d -> d.getCode().equals("CSE")).findFirst().orElseThrow().getId()).stream()
                .filter(yl -> yl.getYearNumber() == 1).findFirst().orElse(null);
        YearLevel y1Bba = yearLevelRepository.findByDepartmentIdOrderByYearNumber(departmentRepository.findByFacultyId(facultyRepository.findByCode("FBE").orElseThrow().getId()).stream()
                .filter(d -> d.getCode().equals("BBA")).findFirst().orElseThrow().getId()).stream()
                .filter(yl -> yl.getYearNumber() == 1).findFirst().orElse(null);

        if (tanvir != null && y1Cse != null && spring2026 != null) {
            yearResultRepository.save(YearResult.builder().student(tanvir).yearLevel(y1Cse).academicSession(spring2026).gpa(3.75).totalCreditHours(9.0).totalGradePoints(33.75).build());
        }
        if (fatema != null && y1Bba != null && spring2026 != null) {
            yearResultRepository.save(YearResult.builder().student(fatema).yearLevel(y1Bba).academicSession(spring2026).gpa(3.43).totalCreditHours(6.0).totalGradePoints(20.55).build());
        }

        log.info("Seeded {} year results.", 2);
    }

    private void seedLeaveTypes() {
        if (leaveTypeRepository.count() > 0) return;

        leaveTypeRepository.save(LeaveType.builder().name("Annual Leave").defaultDaysPerYear(20).paid(true).active(true).build());
        leaveTypeRepository.save(LeaveType.builder().name("Sick Leave").defaultDaysPerYear(12).paid(true).active(true).build());
        leaveTypeRepository.save(LeaveType.builder().name("Casual Leave").defaultDaysPerYear(7).paid(true).active(true).build());
        leaveTypeRepository.save(LeaveType.builder().name("Maternity Leave").defaultDaysPerYear(90).paid(true).active(true).build());
        leaveTypeRepository.save(LeaveType.builder().name("Unpaid Leave").defaultDaysPerYear(30).paid(false).active(true).build());

        log.info("Seeded {} leave types.", 5);
    }

    private void seedLeaveBalances() {
        if (leaveBalanceRepository.count() > 0) return;

        Employee emp1 = employeeRepository.findByEmployeeId("EMP-001").orElse(null);
        Employee emp2 = employeeRepository.findByEmployeeId("EMP-002").orElse(null);
        java.util.List<LeaveType> leaveTypes = leaveTypeRepository.findByActiveTrue();

        if (emp1 != null) {
            for (LeaveType lt : leaveTypes) {
                leaveBalanceRepository.save(LeaveBalance.builder().employee(emp1).leaveType(lt).year(2026).totalDays(lt.getDefaultDaysPerYear()).usedDays(0).build());
            }
        }
        if (emp2 != null) {
            for (LeaveType lt : leaveTypes) {
                leaveBalanceRepository.save(LeaveBalance.builder().employee(emp2).leaveType(lt).year(2026).totalDays(lt.getDefaultDaysPerYear()).usedDays(lt.getName().equals("Sick Leave") ? 3 : 0).build());
            }
        }

        log.info("Seeded {} leave balance records.", 10);
    }

    private void seedLeaveRequests() {
        if (leaveRequestRepository.count() > 0) return;

        Employee emp1 = employeeRepository.findByEmployeeId("EMP-001").orElse(null);
        Employee emp2 = employeeRepository.findByEmployeeId("EMP-002").orElse(null);
        LeaveType annualLeave = leaveTypeRepository.findByActiveTrue().stream().filter(lt -> lt.getName().equals("Annual Leave")).findFirst().orElse(null);
        LeaveType sickLeave = leaveTypeRepository.findByActiveTrue().stream().filter(lt -> lt.getName().equals("Sick Leave")).findFirst().orElse(null);

        if (emp1 != null && annualLeave != null) {
            leaveRequestRepository.save(LeaveRequest.builder().employee(emp1).leaveType(annualLeave).startDate(LocalDate.of(2026, 4, 1)).endDate(LocalDate.of(2026, 4, 3)).totalDays(3).reason("Family vacation").status(LeaveStatus.APPROVED).build());
        }
        if (emp2 != null && sickLeave != null) {
            leaveRequestRepository.save(LeaveRequest.builder().employee(emp2).leaveType(sickLeave).startDate(LocalDate.of(2026, 3, 10)).endDate(LocalDate.of(2026, 3, 12)).totalDays(3).reason("Medical treatment").status(LeaveStatus.APPROVED).build());
        }

        log.info("Seeded {} leave requests.", 2);
    }

    private void seedAppraisals() {
        if (appraisalRepository.count() > 0) return;

        Employee emp1 = employeeRepository.findByEmployeeId("EMP-001").orElse(null);
        Employee emp2 = employeeRepository.findByEmployeeId("EMP-002").orElse(null);

        if (emp1 != null && emp2 != null) {
            appraisalRepository.save(Appraisal.builder().employee(emp1).appraisalDate(LocalDate.of(2026, 1, 15)).reviewYear(2025).rating(AppraisalRating.OUTSTANDING).comments("Exceptional research output and teaching quality.").reviewer(emp2).build());
            appraisalRepository.save(Appraisal.builder().employee(emp2).appraisalDate(LocalDate.of(2026, 1, 20)).reviewYear(2025).rating(AppraisalRating.EXCELLENT).comments("Strong contribution to department activities.").reviewer(emp1).build());
        }

        log.info("Seeded {} appraisals.", 2);
    }

    private void seedApprovalWorkflows() {
        if (approvalWorkflowRepository.count() > 0) return;

        Employee emp1 = employeeRepository.findByEmployeeId("EMP-001").orElse(null);

        if (emp1 != null) {
            approvalWorkflowRepository.save(ApprovalWorkflow.builder().entityType("LeaveRequest").entityId(1L).name("Leave Approval - Tanvir Khan").status(ApprovalStatus.APPROVED).comments("Annual leave approved.").initiatedBy(emp1).build());
            approvalWorkflowRepository.save(ApprovalWorkflow.builder().entityType("Separation").entityId(1L).name("Separation Request").status(ApprovalStatus.PENDING).initiatedBy(emp1).build());
        }

        log.info("Seeded {} approval workflows.", 2);
    }

    private void seedApprovalSteps() {
        if (approvalStepRepository.count() > 0) return;

        java.util.List<ApprovalWorkflow> workflows = approvalWorkflowRepository.findAll();
        Employee emp1 = employeeRepository.findByEmployeeId("EMP-001").orElse(null);
        Employee emp2 = employeeRepository.findByEmployeeId("EMP-002").orElse(null);

        for (ApprovalWorkflow wf : workflows) {
            approvalStepRepository.save(ApprovalStep.builder().workflow(wf).stepOrder(1).approverRole("HR").approver(emp2).status(ApprovalStatus.APPROVED).comments("HR approved.").decidedAt(LocalDateTime.now().minusDays(2)).build());
            approvalStepRepository.save(ApprovalStep.builder().workflow(wf).stepOrder(2).approverRole("ADMIN").approver(emp1).status(wf.getStatus()).comments("Final approval.").decidedAt(LocalDateTime.now().minusDays(1)).build());
        }

        log.info("Seeded {} approval steps.", 4);
    }

    private void seedPromotionHistory() {
        if (promotionHistoryRepository.count() > 0) return;

        Employee emp2 = employeeRepository.findByEmployeeId("EMP-002").orElse(null);
        Designation asstProf = designationRepository.findAll().stream().filter(d -> d.getName().equals("Assistant Professor")).findFirst().orElse(null);
        Grade g3 = gradeRepository.findAll().stream().filter(g -> g.getName().equals("G3")).findFirst().orElse(null);
        Grade g2 = gradeRepository.findAll().stream().filter(g -> g.getName().equals("G2")).findFirst().orElse(null);

        if (emp2 != null && asstProf != null && g3 != null && g2 != null) {
            promotionHistoryRepository.save(PromotionHistory.builder().employee(emp2).fromDesignation(asstProf).toDesignation(designationRepository.findAll().stream().filter(d -> d.getName().equals("Associate Professor")).findFirst().orElse(null)).fromGrade(g3).toGrade(g2).type(PromotionType.PROMOTION).effectiveDate(LocalDate.of(2025, 7, 1)).remarks("Promoted based on excellent performance.").build());
        }

        log.info("Seeded {} promotion history records.", 1);
    }

    private void seedSeparations() {
        if (separationRepository.count() > 0) return;

        Employee emp3 = employeeRepository.findByEmployeeId("EMP-003").orElse(null);

        if (emp3 != null) {
            separationRepository.save(Separation.builder().employee(emp3).type(SeparationType.RESIGNATION).effectiveDate(LocalDate.of(2026, 6, 30)).reason("Personal reasons").approved(false).build());
        }

        log.info("Seeded {} separation records.", 1);
    }

    private void seedJobPostings() {
        if (jobPostingRepository.count() > 0) return;

        jobPostingRepository.save(JobPosting.builder().title("Assistant Professor - CSE").description("Teaching and research position in Computer Science & Engineering department.").department("Computer Science & Engineering").vacancies(2).postingDate(LocalDate.of(2026, 1, 1)).closingDate(LocalDate.of(2026, 3, 31)).active(true).build());
        jobPostingRepository.save(JobPosting.builder().title("Administrative Officer").description("Administrative support role for university operations.").department("Administration").vacancies(1).postingDate(LocalDate.of(2026, 2, 1)).closingDate(LocalDate.of(2026, 4, 15)).active(true).build());

        log.info("Seeded {} job postings.", 2);
    }

    private void seedJobApplications() {
        if (jobApplicationRepository.count() > 0) return;

        java.util.List<JobPosting> postings = jobPostingRepository.findByActiveTrue();

        if (!postings.isEmpty()) {
            jobApplicationRepository.save(JobApplication.builder().jobPosting(postings.get(0)).applicantName("Dr. Mahmudul Hassan").email("mahmudul@gmail.com").phone("01812345678").resumeUrl("/uploads/resumes/mahmudul.pdf").status(JobApplicationStatus.SUBMITTED).build());
            jobApplicationRepository.save(JobApplication.builder().jobPosting(postings.get(0)).applicantName("Farhana Akter").email("farhana@gmail.com").phone("01912345679").resumeUrl("/uploads/resumes/farhana.pdf").status(JobApplicationStatus.UNDER_REVIEW).build());
            if (postings.size() > 1) {
                jobApplicationRepository.save(JobApplication.builder().jobPosting(postings.get(1)).applicantName("Karim Uddin").email("karim@gmail.com").phone("01712345680").resumeUrl("/uploads/resumes/karim.pdf").status(JobApplicationStatus.SUBMITTED).build());
            }
        }

        log.info("Seeded {} job applications.", 3);
    }

    private void seedInterviews() {
        if (interviewRepository.count() > 0) return;

        java.util.List<JobApplication> apps = jobApplicationRepository.findByJobPostingId(jobPostingRepository.findByActiveTrue().get(0).getId());

        if (!apps.isEmpty()) {
            interviewRepository.save(Interview.builder().jobApplication(apps.get(0)).scheduledAt(LocalDateTime.of(2026, 4, 10, 10, 0)).location("Room 301, Admin Building").notes("Technical interview round 1.").completed(true).score(8.5).build());
            if (apps.size() > 1) {
                interviewRepository.save(Interview.builder().jobApplication(apps.get(1)).scheduledAt(LocalDateTime.of(2026, 4, 12, 14, 0)).location("Room 302, Admin Building").notes("HR screening.").completed(false).build());
            }
        }

        log.info("Seeded {} interviews.", 2);
    }

    private void seedSalaryStructures() {
        if (salaryStructureRepository.count() > 0) return;

        java.util.List<Grade> grades = gradeRepository.findAll();
        for (Grade g : grades) {
            salaryStructureRepository.save(SalaryStructure.builder().grade(g).basicSalary(g.getBasicSalary()).houseAllowance(g.getHouseAllowance()).medicalAllowance(g.getMedicalAllowance()).transportAllowance(g.getTransportAllowance()).taxRate(new BigDecimal("10.00")).providentFundRate(new BigDecimal("8.00")).build());
        }

        log.info("Seeded {} salary structures.", grades.size());
    }

    private void seedPayrollRuns() {
        if (payrollRunRepository.count() > 0) return;

        payrollRunRepository.save(PayrollRun.builder().month("January").year(2026).runDate(LocalDate.of(2026, 1, 31)).completed(true).totalEmployees(3).build());
        payrollRunRepository.save(PayrollRun.builder().month("February").year(2026).runDate(LocalDate.of(2026, 2, 28)).completed(true).totalEmployees(3).build());

        log.info("Seeded {} payroll runs.", 2);
    }

    private void seedPayslips() {
        if (payslipRepository.count() > 0) return;

        PayrollRun janRun = payrollRunRepository.findByMonthAndYear("January", 2026).orElse(null);
        Employee emp1 = employeeRepository.findByEmployeeId("EMP-001").orElse(null);
        Employee emp2 = employeeRepository.findByEmployeeId("EMP-002").orElse(null);

        if (janRun != null && emp1 != null) {
            payslipRepository.save(Payslip.builder().payrollRun(janRun).employee(emp1).basicSalary(new BigDecimal("80000")).houseAllowance(new BigDecimal("16000")).medicalAllowance(new BigDecimal("5000")).transportAllowance(new BigDecimal("5000")).grossSalary(new BigDecimal("106000")).taxDeduction(new BigDecimal("10600")).providentFundDeduction(new BigDecimal("8480")).netSalary(new BigDecimal("86920")).build());
        }
        if (janRun != null && emp2 != null) {
            payslipRepository.save(Payslip.builder().payrollRun(janRun).employee(emp2).basicSalary(new BigDecimal("60000")).houseAllowance(new BigDecimal("12000")).medicalAllowance(new BigDecimal("4000")).transportAllowance(new BigDecimal("4000")).grossSalary(new BigDecimal("80000")).taxDeduction(new BigDecimal("8000")).providentFundDeduction(new BigDecimal("6400")).netSalary(new BigDecimal("65600")).build());
        }

        log.info("Seeded {} payslips.", 2);
    }

    private void seedPayments() {
        if (paymentRepository.count() > 0) return;

        User tanvirUser = userRepository.findByEmail("tanvir.ahmed@student.smartuniversity.edu").orElse(null);
        User fatemaUser = userRepository.findByEmail("fatema.khatun@student.smartuniversity.edu").orElse(null);

        if (tanvirUser != null) {
            paymentRepository.save(Payment.builder().transactionId("TXN-2026-001").paymentType(PaymentType.APPLICATION_FEE).referenceEntityType("Applicant").referenceEntityId(1L).user(tanvirUser).amount(new BigDecimal("1500")).currency("BDT").status("COMPLETED").paidAt(LocalDateTime.now().minusDays(60)).build());
        }
        if (fatemaUser != null) {
            paymentRepository.save(Payment.builder().transactionId("TXN-2026-002").paymentType(PaymentType.ADMISSION_FEE).referenceEntityType("Applicant").referenceEntityId(2L).user(fatemaUser).amount(new BigDecimal("25000")).currency("BDT").status("COMPLETED").paidAt(LocalDateTime.now().minusDays(30)).build());
        }

        log.info("Seeded {} payments.", 2);
    }

    private void seedNotifications() {
        if (notificationRepository.count() > 0) return;

        User tanvirUser = userRepository.findByEmail("tanvir.ahmed@student.smartuniversity.edu").orElse(null);
        User fatemaUser = userRepository.findByEmail("fatema.khatun@student.smartuniversity.edu").orElse(null);
        User hrUser = userRepository.findByEmail("hr@smartuniversity.edu").orElse(null);

        if (tanvirUser != null) {
            notificationRepository.save(NotificationEvent.builder().userId(tanvirUser.getId()).type(NotificationType.ADMISSION_STATUS).title("Admission Confirmed").message("Congratulations! You have been admitted to CSE department.").read(true).readAt(LocalDateTime.now().minusDays(50)).build());
        }
        if (fatemaUser != null) {
            notificationRepository.save(NotificationEvent.builder().userId(fatemaUser.getId()).type(NotificationType.ADMISSION_STATUS).title("Admission Confirmed").message("Congratulations! You have been admitted to BBA department.").read(false).build());
            notificationRepository.save(NotificationEvent.builder().userId(fatemaUser.getId()).type(NotificationType.PAYMENT_RECEIVED).title("Payment Received").message("Your admission fee payment of BDT 25,000 has been received.").read(true).readAt(LocalDateTime.now().minusDays(28)).build());
        }
        if (hrUser != null) {
            notificationRepository.save(NotificationEvent.builder().userId(hrUser.getId()).type(NotificationType.GENERAL_NOTICE).title("System Update").message("New HR module features have been deployed.").read(false).build());
        }

        log.info("Seeded {} notifications.", 4);
    }

    private void seedAuditLogs() {
        if (auditLogRepository.count() > 0) return;

        auditLogRepository.save(AuditLog.builder().entityType("Applicant").entityId(1L).action("CREATE").performedBy("admin@smartuniversity.edu").details("New applicant registered: Tanvir Ahmed").build());
        auditLogRepository.save(AuditLog.builder().entityType("Applicant").entityId(2L).action("CREATE").performedBy("admin@smartuniversity.edu").details("New applicant registered: Fatema Khatun").build());
        auditLogRepository.save(AuditLog.builder().entityType("Student").entityId(1L).action("CREATE").performedBy("admin@smartuniversity.edu").details("Student enrolled: Tanvir Ahmed (REG-2026-001)").build());
        auditLogRepository.save(AuditLog.builder().entityType("Employee").entityId(1L).action("CREATE").performedBy("admin@smartuniversity.edu").details("Employee onboarded: Abdul Rahman Khan (EMP-001)").build());
        auditLogRepository.save(AuditLog.builder().entityType("PayrollRun").entityId(1L).action("COMPLETE").performedBy("hr@smartuniversity.edu").details("January 2026 payroll processed for 3 employees.").build());

        log.info("Seeded {} audit logs.", 5);
    }

    private void createRoleIfNotExists(String name, String description, Set<Permission> permissions) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = Role.builder()
                    .name(name)
                    .description(description)
                    .permissions(permissions)
                    .build();
            roleRepository.save(role);
            log.info("Created role: {}", name);
        }
    }

    private User createUserIfNotExists(String email, String password, Set<Role> roles) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .enabled(true)
                    .accountNonLocked(true)
                    .roles(roles)
                    .build();
            User saved = userRepository.save(user);
            log.info("Created user: {} with roles: {}", email, roles.stream().map(Role::getName).toList());
            return saved;
        });
    }
}
