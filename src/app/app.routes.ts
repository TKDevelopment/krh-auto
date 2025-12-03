import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { LandingComponent } from './components/public/landing/landing.component';
import { AboutComponent } from './components/public/about/about.component';
import { ContactComponent } from './components/public/contact/contact.component';
import { ServicesComponent } from './components/public/services/services.component';
import { AutoBodyComponent } from './components/public/auto-body/auto-body.component';
import { AutoCollisionRepairComponent } from './components/public/auto-collision-repair/auto-collision-repair.component';
import { CertificationsComponent } from './components/public/certifications/certifications.component';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', component: LandingComponent },
            { path: 'about', component: AboutComponent },
            { path: 'about/certifications', component: CertificationsComponent },
            { path: 'services', component: ServicesComponent },
            { path: 'services/auto-body', component: AutoBodyComponent },
            { path: 'services/auto-collision-repair', component: AutoCollisionRepairComponent },
            { path: 'contact', component: ContactComponent }
        ]
    }
];
