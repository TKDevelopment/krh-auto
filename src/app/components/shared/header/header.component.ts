import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  menuOpen = false;

  constructor(
    public dialog: MatDialog,
    private toast: ToastService
  ) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openDialog(): void {
    this.dialog.open(ContactModalComponent, {
      panelClass: ['custom-dialog-container', 'no-padding-surface'],
      backdropClass: 'custom-backdrop-class',
      autoFocus: false,
      restoreFocus: false,
      width: '500px',
      maxWidth: '90vw'
    })
    .afterClosed()
    .subscribe(result => {
      if (result?.success) {
        // Optional notifications, toast, or console message
        console.log('Appointment request successfully sent!');
        this.toast.showToast('Appointment request successfully sent!', 'success');
      }
    });
  }
}
