export interface NotificationResponse {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  readAt: string;
  createdAt: string;
}
