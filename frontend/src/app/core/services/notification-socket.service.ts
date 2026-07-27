import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class NotificationSocketService implements OnDestroy {
  private socket: Socket | null = null;
  unreadCount = 0;
  private listeners: Array<() => void> = [];

  constructor(
    private auth: AuthService,
    private toast: ToastService,
    private http: HttpClient,
  ) {}

  connect(): void {
    if (this.socket?.connected) return;

    const token = this.auth.getAccessToken();
    if (!token) return;

    this.fetchUnreadCount();

    this.socket = io(environment.socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected');
    });

    this.socket.on('notification', (data: { title: string; message: string; type: string }) => {
      this.unreadCount++;
      this.toast.info(`${data.title}: ${data.message}`);
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    this.socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  markRead(): void {
    this.unreadCount = Math.max(0, this.unreadCount - 1);
  }

  private fetchUnreadCount(): void {
    this.http
      .get<ApiResponse<{ totalElements: number }>>(`${environment.apiUrl}/notifications`, {
        params: { page: '0', size: '1', read: 'false' },
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.unreadCount = res.data.totalElements;
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.listeners.forEach((unsub) => unsub());
  }
}
