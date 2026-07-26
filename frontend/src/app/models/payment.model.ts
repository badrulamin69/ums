export interface PaymentResponse {
  id: number;
  transactionId: string;
  paymentType: string;
  amount: number;
  currency: string;
  status: string;
  sslCommerzGatewayUrl: string;
  paidAt: string;
}

export interface PaymentInitiateRequest {
  paymentType: string;
  referenceEntityType: string;
  referenceEntityId: number;
  amount: number;
}
