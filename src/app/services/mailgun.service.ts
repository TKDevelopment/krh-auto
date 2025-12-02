import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface EmailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MailgunService {
  private endpoint = environment.mail.apiUrl;

  constructor(private http: HttpClient) {}

  sendEmail(payload: EmailPayload): Observable<any> {
    return this.http.post<any>(this.endpoint, payload);
  }
}
