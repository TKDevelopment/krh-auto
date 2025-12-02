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

    const payload: EmailPayload = {
      to: 'info@krhauto.com', // <- change to whatever inbox should receive these
      subject: `New appointment request from ${this.firstName} ${this.lastName}`,
      text: `
New appointment request from KRH Auto Body website:

Name: ${this.firstName} ${this.lastName}
Email: ${this.email}
Phone: ${this.phone}

Message:
${this.message}
      `.trim(),
      html: `
        <h2>New appointment request from KRH Auto Body website</h2>
        <p><strong>Name:</strong> ${this.firstName} ${this.lastName}</p>
        <p><strong>Email:</strong> ${this.email}</p>
        <p><strong>Phone:</strong> ${this.phone}</p>
        <p><strong>Message:</strong></p>
        <p>${this.message.replace(/\n/g, '<br>')}</p>
      `,
    };

    try {
      await firstValueFrom(this.mailgun.sendEmail(payload));

      // Close the modal and optionally send data back to parent
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
