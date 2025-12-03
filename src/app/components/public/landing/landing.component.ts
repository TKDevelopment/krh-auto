import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { HOME_SEO } from '../../../config/seo.config';

interface HeroSlide {
  title: string;
  subtitle: string;
  kicker: string;
  ctaLabel: string;
  ctaRoute: string;
  align: 'left' | 'right';
  image: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit, OnDestroy {
  slides: HeroSlide[] = [
    {
      kicker: 'KRH Auto Body',
      title: 'Check Out Our Full Service Lineup',
      subtitle:
        'From collision repair to refinishing and frame work, we handle every phase of your vehicle’s recovery under one roof.',
      ctaLabel: 'View All Services',
      ctaRoute: '/services',
      align: 'left',
      image: 'assets/images/1458-1080x675.webp',
    },
    {
      kicker: 'Free, No-Pressure Estimates',
      title: 'Submit a Contact Request in Minutes',
      subtitle:
        'Tell us what happened and we’ll follow up with a clear repair plan and timeline to get you back on the road.',
      ctaLabel: 'Request a Free Estimate',
      ctaRoute: '/contact',
      align: 'right',
      image: 'assets/images/Auto-Body-Repair-1.jpg',
    },
    {
      kicker: 'Towing & Emergency Support',
      title: 'Towing Services When You Need Them Most',
      subtitle:
        'Had a bad day on the road? We can help arrange towing and get your vehicle safely to our shop for evaluation.',
      ctaLabel: 'Arrange Towing & Repair',
      ctaRoute: '/contact',
      align: 'left',
      image: 'assets/images/cheapest-way-to-tow-a-car-from-state-to-state-1024x682.jpg',
    },
    {
      kicker: 'Insurance Claims Assistance',
      title: 'We Speak Insurance So You Don’t Have To',
      subtitle:
        'We coordinate directly with your insurance company, advocate for proper repairs, and keep you in the loop at every step.',
      ctaLabel: 'Get Claim Help',
      ctaRoute: '/contact',
      align: 'right',
      image: 'assets/images/Insurance-Adjuster.jpg',
    },
  ];

  constructor(private seo: SeoService) {}

  currentSlide = 0;
  private autoSlideTimer: any;

  ngOnInit(): void {
    this.startAutoSlide();
    this.seo.update(HOME_SEO);
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

  private startAutoSlide(): void {
    this.clearAutoSlide();
    this.autoSlideTimer = setInterval(() => {
      this.nextSlide();
    }, 10000); // 10 seconds per slide
  }

  private clearAutoSlide(): void {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = null;
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.startAutoSlide(); // reset timer after manual navigation
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.startAutoSlide(); // reset timer after manual navigation
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.startAutoSlide(); // already here — good!
  }
}
