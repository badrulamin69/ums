export interface FaceEnrollRequest {
  base64Image: string;
}

export interface FaceVerifyRequest {
  base64Image: string;
}

export interface FaceVerifyResponse {
  matched: boolean;
  employeeId?: number;
  employeeName?: string;
  studentId?: number;
  studentName?: string;
  confidence: number;
  message: string;
}

export interface FaceStatusResponse {
  enrolled: boolean;
}
