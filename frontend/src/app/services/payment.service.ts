import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaymentResponse, PaymentInitiateRequest } from '../models/payment.model';
import { ApiResponse } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  initiatePayment(request: PaymentInitiateRequest): Observable<ApiResponse<PaymentResponse>> {
    return this.http.post<ApiResponse<PaymentResponse>>(`${this.apiUrl}/initiate`, request);
  }

  getPaymentByTransactionId(transactionId: string): Observable<ApiResponse<PaymentResponse>> {
    return this.http.get<ApiResponse<PaymentResponse>>(`${this.apiUrl}/${transactionId}`);
  }
}
