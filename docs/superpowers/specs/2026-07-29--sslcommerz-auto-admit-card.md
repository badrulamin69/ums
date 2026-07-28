# Auto-Generate Admit Card After SSLCommerz Payment

## Goal

After a successful SSLCommerz payment callback, automatically generate the applicant's admit card, send email notification, and push a Socket.IO real-time notification — all in one server-side flow.

## Current State

- SSLCommerz integration is fully implemented (initiation, callback, signature validation)
- `PaymentService.handleCallback()` validates signature and updates payment status to `COMPLETED`
- `AdmitCardService.generate()` checks `paymentCompleted` flag and creates admit card — but requires admin to manually call `POST /api/admit-cards/generate/{applicantId}`
- `Payment.initiate()` stores `referenceEntityType="APPLICANT"` and `referenceEntityId=applicantId`

## Changes

### 1. Add `ADMIT_CARD_GENERATED` to NotificationType enum

**File:** `src/main/java/com/smartuniversity/common/enums/NotificationType.java`

Add `ADMIT_CARD_GENERATED` after `PAYMENT_RECEIVED`.

### 2. Modify `PaymentService.handleCallback()` to auto-generate admit card

**File:** `src/main/java/com/smartuniversity/payment/service/PaymentService.java`

After setting `payment.setStatus("COMPLETED")` and saving:

1. If `payment.getReferenceEntityType().equals("APPLICANT")`:
   - Call `applicantService.updatePaymentStatus(payment.getReferenceEntityId(), true)`
   - Call `admitCardService.generate(payment.getReferenceEntityId())`
   - Create and save a `NotificationEvent` with type `ADMIT_CARD_GENERATED`
   - Call `socketIOEventPublisher.sendNotification(userEmail, notificationEvent)`
   - Call `emailService.sendAdmitCardEmail(userEmail, admitCardNumber)`

2. Wrap admit card generation in try-catch — if it fails, log the error but don't fail the payment. Admin can retry via existing manual endpoint.

**New dependencies to inject:**
- `ApplicantService`
- `AdmitCardService`
- `NotificationRepository`
- `SocketIOEventPublisher`
- `EmailService`

### 3. Add `sendAdmitCardEmail()` to EmailService

**File:** `src/main/java/com/smartuniversity/notification/service/EmailService.java`

New method:
```java
@Async
public void sendAdmitCardEmail(String to, String admitCardNumber) {
    sendEmail(to, "Smart University - Admit Card Generated",
            "Your admit card has been generated. Admit Card Number: " + admitCardNumber +
            ". Please login to your dashboard to view and download it.");
}
```

### 4. Make SSLCommerz callback URLs configurable

**File:** `src/main/java/com/smartuniversity/payment/service/SslCommerzService.java`

Replace hardcoded `http://localhost:8085` with `@Value("${app.backend-url:http://localhost:8085}")`.

### 5. Frontend: Payment success/failure redirect page

**New component:** `frontend/src/app/features/student/payment-result/payment-result.component.ts`

- Route: `/student/payment-result`
- Query params: `transactionId`, `status`
- On load: call `GET /api/payments/{transactionId}` to get payment status
- Show success message with admit card number (if generated) or failure message
- Redirect to student dashboard after 5 seconds

**Route registration** in `app.routes.ts`.

## Data Flow

```
SSLCommerz confirms payment
  → POST /api/payments/callback?transactionId=TXN-xxx&status=SUCCESS&valId=...
  → PaymentService.handleCallback()
    → Validates signature via SslCommerzService
    → Sets payment status = COMPLETED
    → Sets applicant.paymentCompleted = true, status = PAYMENT_VERIFIED
    → AdmitCardService.generate(applicantId)
      → Creates AdmitCard with number "AC-XXXXXXXX"
    → Saves NotificationEvent (ADMIT_CARD_GENERATED)
    → SocketIOEventPublisher sends real-time push
    → EmailService sends admit card email
  → Returns PaymentResponse
```

## Error Handling

- Admit card generation failure: logged, payment still succeeds. Admin can manually generate via existing endpoint.
- Email/Socket.IO failure: logged, non-critical. Admit card is still created.
- Signature validation failure: payment marked as FAILED, no admit card generated.

## Testing

1. Initiate payment as applicant via `POST /api/payments/initiate`
2. Complete payment on SSLCommerz sandbox
3. Verify callback updates payment to COMPLETED
4. Verify applicant `paymentCompleted = true` and status = `PAYMENT_VERIFIED`
5. Verify admit card is auto-generated with valid number
6. Verify email is sent to applicant
7. Verify Socket.IO notification is pushed
8. Verify frontend shows admit card on dashboard
