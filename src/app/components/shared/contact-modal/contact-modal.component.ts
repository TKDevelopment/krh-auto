import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MailgunService, EmailPayload } from '../../../services/mailgun.service'; // adjust path if needed
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
})
export class ContactModalComponent {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  message = '';

  submitting = false;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ContactModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email?: string },
    private mailgun: MailgunService
  ) {
    if (data && data.email) {
      this.email = data.email;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async submit(form: NgForm): Promise<void> {
    if (form.invalid) {
      return;
    }

    this.submitting = true;
    this.error = null;

    const fullName = `${this.firstName} ${this.lastName}`.trim();
    const safeMessageHtml = this.message.replace(/\n/g, '<br />');

    // Shared email shell (same as contact.component)
    const emailShellTop = (title: string, subtitle: string) => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(15,23,42,0.15);">
                <!-- Header -->
                <tr>
                  <td style="padding:18px 24px;background:linear-gradient(135deg,#3a2c5f,#8b5cff);color:#f9fafb;">
                    <h1 style="margin:0 0 4px 0;font-size:20px;font-weight:700;">${title}</h1>
                    <p style="margin:0;font-size:13px;opacity:0.9;">${subtitle}</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:20px 24px 24px 24px;color:#111827;font-size:14px;line-height:1.5;">
    `;

    const emailShellBottom = `
                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0 12px 0;" />
                    <p style="margin:0;font-size:11px;color:#6b7280;">
                      KRH Auto Body • North Kingstown, RI<br />
                      This message was sent automatically from the KRH Auto website.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // 1) Email to YOU (admin) – appointment/contact request
    const adminHtml = `
      ${emailShellTop(
        'New Appointment Request Received',
        'A new visitor has requested an appointment through the KRH Auto Body website.'
      )}
        <p style="margin:0 0 12px 0;">
          You’ve received a new appointment request from <strong>${fullName}</strong>.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px 0;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;width:90px;font-size:13px;color:#6b7280;">Name</td>
            <td style="padding:6px 0;font-size:13px;color:#111827;font-weight:500;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;width:90px;font-size:13px;color:#6b7280;">Email</td>
            <td style="padding:6px 0;font-size:13px;color:#111827;">
              <a href="mailto:${this.email}" style="color:#3a2c5f;text-decoration:none;">${this.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;width:90px;font-size:13px;color:#6b7280;">Phone</td>
            <td style="padding:6px 0;font-size:13px;color:#111827;">${this.phone}</td>
          </tr>
        </table>

        <div style="margin:0 0 12px 0;">
          <p style="margin:0 0 6px 0;font-size:13px;color:#6b7280;">Message</p>
          <div style="padding:10px 12px;border-radius:10px;background-color:#f3f4ff;border:1px solid #e5e7eb;color:#111827;font-size:13px;">
            ${safeMessageHtml}
          </div>
        </div>
      ${emailShellBottom}
    `;

    const adminPayload: EmailPayload = {
      to: 'krhautobody1943@gmail.com', // same inbox as main contact component
      subject: `New appointment request from ${fullName}`,
      text: `
        New appointment request from KRH Auto Body website:

        Name: ${fullName}
        Email: ${this.email}
        Phone: ${this.phone}

        Message:
        ${this.message}
      `.trim(),
      html: adminHtml,
    };

    // 2) Email to CLIENT (confirmation)
    const clientHtml = `
      ${emailShellTop(
        'We\'ve Received Your Appointment Request',
        'Thanks for reaching out to KRH Auto Body.'
      )}
        <p style="margin:0 0 12px 0;">
          Hi ${this.firstName},
        </p>
        <p style="margin:0 0 12px 0;">
          Thank you for contacting <strong>KRH Auto Body</strong> to request an appointment.
          We’ve received your message and will review your request shortly. A member of our team
          will reach out to you using the contact details you provided.
        </p>

        <div style="margin:0 0 16px 0;">
          <p style="margin:0 0 6px 0;font-size:13px;color:#6b7280;">Here’s a copy of what you sent us:</p>
          <div style="padding:10px 12px;border-radius:10px;background-color:#f3f4ff;border:1px solid #e5e7eb;color:#111827;font-size:13px;">
            ${safeMessageHtml}
          </div>
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px 0;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;width:110px;font-size:13px;color:#6b7280;">Name</td>
            <td style="padding:6px 0;font-size:13px;color:#111827;font-weight:500;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;width:110px;font-size:13px;color:#6b7280;">Email</td>
            <td style="padding:6px 0;font-size:13px;color:#111827;">${this.email}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;width:110px;font-size:13px;color:#6b7280;">Phone</td>
            <td style="padding:6px 0;font-size:13px;color:#111827;">${this.phone}</td>
          </tr>
        </table>

        <p style="margin:0;font-size:12px;color:#111827;">
          – KRH Auto Body
        </p>
      ${emailShellBottom}
    `;

    const clientPayload: EmailPayload = {
      to: this.email,
      subject: 'We’ve received your appointment request – KRH Auto Body',
      text: `
        Hi ${this.firstName},

        Thank you for contacting KRH Auto Body. We’ve received your appointment request and will be in touch soon.

        Here’s a copy of your message:

        ${this.message}

        Name: ${fullName}
        Email: ${this.email}
        Phone: ${this.phone}

        – KRH Auto Body
      `.trim(),
      html: clientHtml,
    };

    try {
      // Send to admin first
      await firstValueFrom(this.mailgun.sendEmail(adminPayload));

      // Then confirmation to client
      await firstValueFrom(this.mailgun.sendEmail(clientPayload));

      // Close the modal and return data to parent
      this.dialogRef.close({
        success: true,
        form: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone,
          message: this.message,
        },
      });
    } catch (err) {
      console.error('Failed to send appointment request:', err);
      this.error = 'Something went wrong sending your request. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}
