package com.smartuniversity.admission.service;

import com.smartuniversity.admission.dto.AdmitCardResponse;
import com.smartuniversity.admission.entity.AdmitCard;
import com.smartuniversity.admission.entity.Applicant;
import com.smartuniversity.admission.mapper.AdmitCardMapper;
import com.smartuniversity.admission.repository.AdmitCardRepository;
import com.smartuniversity.admission.repository.ApplicantRepository;
import com.smartuniversity.common.exception.BadRequestException;
import com.smartuniversity.common.exception.ResourceNotFoundException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import java.io.IOException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class AdmitCardService {

    private final AdmitCardRepository admitCardRepository;
    private final ApplicantRepository applicantRepository;
    private final AdmitCardMapper admitCardMapper;

    public AdmitCardService(AdmitCardRepository admitCardRepository,
                            ApplicantRepository applicantRepository,
                            AdmitCardMapper admitCardMapper) {
        this.admitCardRepository = admitCardRepository;
        this.applicantRepository = applicantRepository;
        this.admitCardMapper = admitCardMapper;
    }

    @Transactional
    public AdmitCardResponse generate(Long applicantId) {
        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", applicantId));

        if (!applicant.isPaymentCompleted()) {
            throw new BadRequestException("Payment not completed. Cannot generate admit card.");
        }

        admitCardRepository.findByApplicantId(applicantId)
                .ifPresent(card -> {
                    throw new BadRequestException("Admit card already generated for this applicant");
                });

        AdmitCard admitCard = AdmitCard.builder()
                .applicant(applicant)
                .admitCardNumber("AC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .examDate(java.time.LocalDateTime.now().plusDays(30))
                .examCenter("Smart University - Main Campus")
                .downloaded(false)
                .build();

        admitCard = admitCardRepository.save(admitCard);
        return admitCardMapper.toResponse(admitCard);
    }

    public AdmitCardResponse getByApplicantId(Long applicantId) {
        AdmitCard admitCard = admitCardRepository.findByApplicantId(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("AdmitCard", "applicantId", applicantId));
        return admitCardMapper.toResponse(admitCard);
    }

    public AdmitCardResponse getByUserId(Long userId) {
        Applicant applicant = applicantRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "userId", userId));
        AdmitCard admitCard = admitCardRepository.findByApplicantId(applicant.getId())
                .orElseThrow(() -> new ResourceNotFoundException("AdmitCard", "applicantId", applicant.getId()));
        return admitCardMapper.toResponse(admitCard);
    }

    @Transactional
    public void markAsDownloaded(Long applicantId) {
        AdmitCard admitCard = admitCardRepository.findByApplicantId(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("AdmitCard", "applicantId", applicantId));
        if (!admitCard.isDownloaded()) {
            admitCard.setDownloaded(true);
            admitCardRepository.save(admitCard);
        }
    }

    @Transactional(readOnly = true)
    public byte[] generatePdf(Long applicantId) throws IOException {
        AdmitCard admitCard = admitCardRepository.findByApplicantId(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("AdmitCard", "applicantId", applicantId));
        Applicant applicant = admitCard.getApplicant();
        applicant.getFirstName(); // force lazy load

        PDDocument document = new PDDocument();
        try {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDPageContentStream cs = new PDPageContentStream(document, page,
                    PDPageContentStream.AppendMode.OVERWRITE, true);
            float y = 750;
            float leftMargin = 70;
            float pageWidth = PDRectangle.A4.getWidth();

            PDType1Font bold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font regular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            cs.beginText();
            cs.setFont(bold, 22);
            cs.setLeading(28);
            cs.newLineAtOffset(0, y);
            cs.showText("Smart University");
            cs.newLineAtOffset(0, -28);
            cs.setFont(regular, 11);
            cs.setLeading(16);
            cs.showText("Examination Admit Card");
            cs.endText();

            y -= 60;
            cs.setStrokingColor(0.0f, 0.0f, 0.0f);
            cs.moveTo(leftMargin, y);
            cs.lineTo(pageWidth - 70, y);
            cs.stroke();

            y -= 40;
            drawField(cs, bold, 10, leftMargin, y, "Admit Card Number:  " + admitCard.getAdmitCardNumber());
            y -= 25;
            drawField(cs, regular, 10, leftMargin, y, "Application Number:  " + applicant.getApplicationNumber());
            y -= 25;
            drawField(cs, regular, 10, leftMargin, y, "Applicant Name:  " + applicant.getFirstName() + " " + applicant.getLastName());
            y -= 25;
            drawField(cs, regular, 10, leftMargin, y, "Phone:  " + applicant.getPhone());
            y -= 25;
            String dob = applicant.getDateOfBirth() != null ? applicant.getDateOfBirth().toString() : "N/A";
            drawField(cs, regular, 10, leftMargin, y, "Date of Birth:  " + dob);
            y -= 25;
            drawField(cs, regular, 10, leftMargin, y, "Gender:  " + (applicant.getGender() != null ? applicant.getGender() : "N/A"));

            y -= 40;
            cs.setStrokingColor(0.78f, 0.78f, 0.78f);
            cs.moveTo(leftMargin, y);
            cs.lineTo(pageWidth - 70, y);
            cs.stroke();

            y -= 30;
            String examDateStr = admitCard.getExamDate() != null
                    ? admitCard.getExamDate().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, hh:mm a"))
                    : "To be announced";
            drawField(cs, bold, 10, leftMargin, y, "Exam Date:  " + examDateStr);
            y -= 25;
            drawField(cs, regular, 10, leftMargin, y, "Exam Center:  " + (admitCard.getExamCenter() != null ? admitCard.getExamCenter() : "To be announced"));

            y -= 50;
            cs.setStrokingColor(0.78f, 0.78f, 0.78f);
            cs.moveTo(leftMargin, y);
            cs.lineTo(pageWidth - 70, y);
            cs.stroke();

            y -= 25;
            drawField(cs, bold, 10, leftMargin, y, "Instructions");

            String[] instructions = {
                    "1. Bring this admit card along with a valid photo ID to the examination center.",
                    "2. Arrive at the examination center at least 30 minutes before the scheduled time.",
                    "3. No electronic devices (phones, calculators, etc.) are allowed in the exam hall.",
                    "4. Follow all invigilator instructions during the examination."
            };
            y -= 20;
            cs.beginText();
            cs.setFont(regular, 9);
            cs.setLeading(15);
            cs.newLineAtOffset(leftMargin, y);
            for (String line : instructions) {
                cs.showText(line);
                cs.newLineAtOffset(0, -15);
            }
            cs.endText();

            y -= 60;
            cs.beginText();
            cs.setFont(regular, 9);
            cs.setLeading(14);
            cs.newLineAtOffset(pageWidth - 200, y);
            cs.showText("Authorized Signature");
            cs.endText();
            cs.setStrokingColor(0.0f, 0.0f, 0.0f);
            cs.moveTo(pageWidth - 200, y + 10);
            cs.lineTo(pageWidth - 80, y + 10);
            cs.stroke();

            cs.close();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        } finally {
            document.close();
        }
    }

    private void drawField(PDPageContentStream cs, PDType1Font font, float fontSize,
                           float x, float y, String text) throws IOException {
        cs.beginText();
        cs.setFont(font, fontSize);
        cs.setLeading(16);
        cs.newLineAtOffset(x, y);
        cs.showText(text);
        cs.endText();
    }
}
