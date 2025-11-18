import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName:  ['', [Validators.required, Validators.minLength(2)]],
      phone:     ['', [
        Validators.required,
        // Accepts 1234567890, 123-456-7890, (123) 456-7890, etc.
        Validators.pattern(/^(\+1\s?)?(\(?\d{3}\)?)[-\s.]?\d{3}[-\s.]?\d{4}$/)
      ]],
      email:     ['', [Validators.required, Validators.email]],
      message:   ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    });
  }

  // Easy getters for template
  get firstName() { return this.form.get('firstName')!; }
  get lastName()  { return this.form.get('lastName')!; }
  get phone()     { return this.form.get('phone')!; }
  get email()     { return this.form.get('email')!; }
  get message()   { return this.form.get('message')!; }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.submitted = false;

    try {
      // Replace with your real submission (e.g., call an Edge Function / API)
      const payload = this.form.value;
      console.log('Contact form payload:', payload);

      // Simulate latency
      await new Promise(res => setTimeout(res, 800));

      this.submitted = true;
      this.form.reset();
    } catch (err) {
      console.error('Contact form submission failed:', err);
      // Show a toast/snackbar as desired
    } finally {
      this.submitting = false;
    }
  }
}
