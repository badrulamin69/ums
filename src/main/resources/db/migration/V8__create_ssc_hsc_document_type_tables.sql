CREATE TABLE ssc_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    applicant_id BIGINT NOT NULL UNIQUE,
    board VARCHAR(50) NOT NULL,
    exam_year INT NOT NULL,
    roll_number VARCHAR(30) NOT NULL,
    registration_number VARCHAR(30),
    `group` VARCHAR(30) NOT NULL,
    institution VARCHAR(150),
    gpa DECIMAL(4, 2) NOT NULL,
    science_gpa DECIMAL(4, 2),
    math_gpa DECIMAL(4, 2),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ssc_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id)
);

CREATE TABLE hsc_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    applicant_id BIGINT NOT NULL UNIQUE,
    board VARCHAR(50) NOT NULL,
    exam_year INT NOT NULL,
    roll_number VARCHAR(30) NOT NULL,
    registration_number VARCHAR(30),
    `group` VARCHAR(30) NOT NULL,
    institution VARCHAR(150),
    gpa DECIMAL(4, 2) NOT NULL,
    science_gpa DECIMAL(4, 2),
    math_gpa DECIMAL(4, 2),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_hsc_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id)
);

CREATE TABLE document_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    required BOOLEAN NOT NULL DEFAULT TRUE,
    allowed_formats VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
