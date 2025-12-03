import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MailgunService, EmailPayload } from '../../../services/mailgun.service'; // adjust path as needed
import { ToastService } from '../../../services/toast.service';
import { SeoService } from '../../../services/seo.service';
import { CONTACT_SEO } from '../../../config/seo.config';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  form: FormGroup;
  submitting = false;
  submitted = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private mailgun: MailgunService,
    private toast: ToastService,
    private seo: SeoService
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\+1\s?)?(\(?\d{3}\)?)[-\s.]?\d{3}[-\s.]?\d{4}$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    });
  }

  ngOnInit(): void {
    this.seo.update(CONTACT_SEO);
  }

  // Getters
  get firstName() { return this.form.get('firstName')!; }
  get lastName() { return this.form.get('lastName')!; }
  get phone() { return this.form.get('phone')!; }
  get email() { return this.form.get('email')!; }
  get message() { return this.form.get('message')!; }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.submitted = false;
    this.error = null;

    const value = this.form.value;

    const fullName = `${value.firstName} ${value.lastName}`.trim();
    const safeMessageHtml = value.message.replace(/\n/g, '<br />');

    // Shared base styles for both emails
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

    // 1) Email to YOU (admin/owner)
    const adminHtml = `
      ${emailShellTop(
        'New Contact Request Received',
        'A new visitor has reached out through the KRH Auto Body website.'
      )}
        <p style="margin:0 0 12px 0;">
          You’ve received a new contact request from <strong>${fullName}</strong>.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px 0;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;width:90px;font-size:13px;color:#6b7280;">Name</td>
            <td style="padding:6px 0;font-size:13px;color:#111827;font-weight:500;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;width:90px;font-size:13px;color:#6b7280;">Email</td>
            <td style="padding:6px 0;font-size:13px;color:#111827;">
              <a href="mailto:${value.email}" style="color:#3a2c5f;text-decoration:none;">${value.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;width:90px;font-size:13px;color:#6b7280;">Phone</td>
            <td style="padding:6px 0;font-size:13px;color:#111827;">${value.phone}</td>
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
      to: 'krhautobody1943@gmail.com',
      subject: `New contact request from ${fullName}`,
      text: `
        New contact request from KRH Auto Body website:

        Name: ${fullName}
        Email: ${value.email}
        Phone: ${value.phone}

        Message:
        ${value.message}
      `.trim(),
      html: adminHtml,
    };

    // 2) Email to CLIENT (confirmation)
    const clientHtml = `
      ${emailShellTop(
        'We\'ve Received Your Request',
        'Thanks for reaching out to KRH Auto Body.'
      )}
        <p style="margin:0 0 12px 0;">
          Hi ${value.firstName},
        </p>
        <p style="margin:0 0 12px 0;">
          Thank you for contacting <strong>KRH Auto Body</strong>. We’ve received your message and
          will review your request shortly. A member of our team will reach out to you
          using the contact details you provided.
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
            <td style="padding:6px 0;font-size:13px;color:#111827;">${value.email}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;width:110px;font-size:13px;color:#6b7280;">Phone</td>
            <td style="padding:6px 0;font-size:13px;color:#111827;">${value.phone}</td>
          </tr>
        </table>

        <p style="margin:0;font-size:12px;color:#111827;">
          – KRH Auto Body
        </p>
      ${emailShellBottom}
    `;

    const clientPayload: EmailPayload = {
      to: value.email,
      subject: 'We’ve received your contact request – KRH Auto Body',
      text: `
        Hi ${value.firstName},

        Thank you for contacting KRH Auto Body. We’ve received your message and will be in touch soon.

        Here’s a copy of your message:

        ${value.message}

        Name: ${fullName}
        Email: ${value.email}
        Phone: ${value.phone}

        – KRH Auto Body
      `.trim(),
      html: clientHtml,
    };

    try {
      // Send to you first (so at least you always get notified)
      await firstValueFrom(this.mailgun.sendEmail(adminPayload));

      // Then send confirmation to client
      await firstValueFrom(this.mailgun.sendEmail(clientPayload));

      this.submitted = true;
      this.form.reset();
      this.toast.showToast('Your message has been sent successfully!', 'success');
    } catch (err) {
      console.error('Contact form submission failed:', err);
      this.error = 'Something went wrong sending your message. Please try again.';
      this.toast.showToast(this.error, 'error');
    } finally {
      this.submitting = false;
    }
  }
}
