CREATE TABLE faculties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50),
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    faculty_id BIGINT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_dept_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id)
);

CREATE TABLE admission_circulars (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    session VARCHAR(20) NOT NULL,
    faculty_id BIGINT NOT NULL,
    registration_start_date DATE NOT NULL,
    registration_end_date DATE NOT NULL,
    application_fee DECIMAL(10, 2) NOT NULL,
    total_seats INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_circular_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id)
);

CREATE TABLE applicants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    address VARCHAR(500),
    circular_id BIGINT NOT NULL,
    preferred_department_id BIGINT,
    status VARCHAR(30) NOT NULL DEFAULT 'REGISTRATION_OPEN',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    payment_completed BOOLEAN NOT NULL DEFAULT FALSE,
    application_number VARCHAR(50) UNIQUE,
    merit_score DOUBLE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_applicant_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_applicant_circular FOREIGN KEY (circular_id) REFERENCES admission_circulars(id),
    CONSTRAINT fk_applicant_dept FOREIGN KEY (preferred_department_id) REFERENCES departments(id)
);

CREATE TABLE applicant_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    applicant_id BIGINT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id)
);

CREATE TABLE merit_lists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    circular_id BIGINT NOT NULL,
    department_id BIGINT NOT NULL,
    applicant_id BIGINT NOT NULL,
    merit_score DOUBLE NOT NULL,
    merit_position INT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_merit_circular FOREIGN KEY (circular_id) REFERENCES admission_circulars(id),
    CONSTRAINT fk_merit_dept FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_merit_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id)
);

CREATE TABLE admit_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    applicant_id BIGINT NOT NULL UNIQUE,
    admit_card_number VARCHAR(50) NOT NULL UNIQUE,
    exam_date TIMESTAMP,
    exam_center VARCHAR(255),
    downloaded BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_admit_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id)
);
