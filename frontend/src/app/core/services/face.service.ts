import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { FaceVerifyResponse, FaceStatusResponse } from '../models/face.model';

@Injectable({ providedIn: 'root' })
export class FaceService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  enrollEmployee(employeeId: number, base64Image: string): Observable<ApiResponse<null>> {
    const params = new HttpParams().set('employeeId', employeeId.toString());
    return this.http.post<ApiResponse<null>>(`${this.api}/employee/face/enroll`, { base64Image }, { params });
  }

  enrollEmployeeSelf(base64Image: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.api}/employee/face/enroll/self`, { base64Image });
  }

  verifyEmployeeCheckIn(base64Image: string): Observable<ApiResponse<FaceVerifyResponse>> {
    return this.http.post<ApiResponse<FaceVerifyResponse>>(`${this.api}/employee/face/verify-check-in`, { base64Image });
  }

  verifyEmployeeCheckOut(base64Image: string): Observable<ApiResponse<FaceVerifyResponse>> {
    return this.http.post<ApiResponse<FaceVerifyResponse>>(`${this.api}/employee/face/verify-check-out`, { base64Image });
  }

  getEmployeeFaceStatus(): Observable<ApiResponse<FaceStatusResponse>> {
    return this.http.get<ApiResponse<FaceStatusResponse>>(`${this.api}/employee/face/status`);
  }

  enrollStudentSelf(base64Image: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.api}/student/face/enroll/self`, { base64Image });
  }

  verifyStudentCheckIn(base64Image: string): Observable<ApiResponse<FaceVerifyResponse>> {
    return this.http.post<ApiResponse<FaceVerifyResponse>>(`${this.api}/student/face/check-in`, { base64Image });
  }

  getStudentFaceStatus(): Observable<ApiResponse<FaceStatusResponse>> {
    return this.http.get<ApiResponse<FaceStatusResponse>>(`${this.api}/student/face/status`);
  }
}
