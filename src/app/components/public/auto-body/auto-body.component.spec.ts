import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoBodyComponent } from './auto-body.component';

describe('AutoBodyComponent', () => {
  let component: AutoBodyComponent;
  let fixture: ComponentFixture<AutoBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
