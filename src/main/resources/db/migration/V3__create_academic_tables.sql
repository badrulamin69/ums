CREATE TABLE academic_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    start_year INT NOT NULL,
    end_year INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE year_levels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    year_number INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    department_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_yearlevel_dept FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    credit_hours DOUBLE NOT NULL,
    year_level_id BIGINT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_yearlevel FOREIGN KEY (year_level_id) REFERENCES year_levels(id)
);

CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    employee_id VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    employee_type VARCHAR(20) NOT NULL,
    designation_id BIGINT,
    grade_id BIGINT,
    department VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE designations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    level INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE grades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    basic_salary DECIMAL(12, 2) NOT NULL,
    house_allowance DECIMAL(12, 2) NOT NULL,
    medical_allowance DECIMAL(12, 2) NOT NULL,
    transport_allowance DECIMAL(12, 2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE employees ADD CONSTRAINT fk_emp_designation FOREIGN KEY (designation_id) REFERENCES designations(id);
ALTER TABLE employees ADD CONSTRAINT fk_emp_grade FOREIGN KEY (grade_id) REFERENCES grades(id);

CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    applicant_id BIGINT UNIQUE,
    registration_number VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    cgpa DOUBLE NOT NULL DEFAULT 0.0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_student_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id)
);

CREATE TABLE course_teachers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    academic_session_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (course_id, employee_id, academic_session_id),
    CONSTRAINT fk_ct_course FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT fk_ct_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_ct_session FOREIGN KEY (academic_session_id) REFERENCES academic_sessions(id)
);

CREATE TABLE student_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    academic_session_id BIGINT NOT NULL,
    grade_point DOUBLE NOT NULL,
    credit_hours DOUBLE NOT NULL,
    letter_grade VARCHAR(5),
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (student_id, course_id, academic_session_id),
    CONSTRAINT fk_sr_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_sr_course FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT fk_sr_session FOREIGN KEY (academic_session_id) REFERENCES academic_sessions(id)
);

CREATE TABLE year_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    year_level_id BIGINT NOT NULL,
    academic_session_id BIGINT NOT NULL,
    gpa DOUBLE NOT NULL,
    total_credit_hours DOUBLE NOT NULL,
    total_grade_points DOUBLE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (student_id, year_level_id, academic_session_id),
    CONSTRAINT fk_yr_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_yr_yearlevel FOREIGN KEY (year_level_id) REFERENCES year_levels(id),
    CONSTRAINT fk_yr_session FOREIGN KEY (academic_session_id) REFERENCES academic_sessions(id)
);
