import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { ABOUT_SEO } from '../../../config/seo.config';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update(ABOUT_SEO);
  }
}
