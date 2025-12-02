import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MailgunService, EmailPayload } from '../../../services/mailgun.service'; // adjust path as needed
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  form: FormGroup;
  submitting = false;
  submitted = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private mailgun: MailgunService,
    private toast: ToastService
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

    // Email KRH inbox (change this to the real shop email)
    const payload: EmailPayload = {
      to: 'knotttristan@gmail.com', // or whatever inbox you want to receive these
      subject: `New contact request from ${value.firstName} ${value.lastName}`,
      text: `
        New contact request from KRH Auto Body website:

        Name: ${value.firstName} ${value.lastName}
        Email: ${value.email}
        Phone: ${value.phone}

        Message:
        ${value.message}
      `.trim(),
      // Optional HTML version
      html: `
        <h2>New contact request from KRH Auto Body website</h2>
        <p><strong>Name:</strong> ${value.firstName} ${value.lastName}</p>
        <p><strong>Email:</strong> ${value.email}</p>
        <p><strong>Phone:</strong> ${value.phone}</p>
        <p><strong>Message:</strong></p>
        <p>${value.message.replace(/\n/g, '<br>')}</p>
      `,
    };

    try {
      await firstValueFrom(this.mailgun.sendEmail(payload));
      this.submitted = true;
      this.form.reset();
      this.toast.showToast("Your message has been sent successfully!", "success");
    } catch (err) {
      console.error('Contact form submission failed:', err);
      this.error = 'Something went wrong sending your message. Please try again.';
      this.toast.showToast(this.error, "error");
    } finally {
      this.submitting = false;
    }
  }
}
