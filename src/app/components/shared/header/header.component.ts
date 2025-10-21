import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  menuOpen = false;

  constructor(public dialog: MatDialog) {}

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
    });
  }
}
