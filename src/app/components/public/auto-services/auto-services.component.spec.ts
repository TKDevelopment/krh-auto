import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoServicesComponent } from './auto-services.component';

describe('AutoServicesComponent', () => {
  let component: AutoServicesComponent;
  let fixture: ComponentFixture<AutoServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
