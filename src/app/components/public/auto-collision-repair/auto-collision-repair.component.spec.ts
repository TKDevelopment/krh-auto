import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCollisionRepairComponent } from './auto-collision-repair.component';

describe('AutoCollisionRepairComponent', () => {
  let component: AutoCollisionRepairComponent;
  let fixture: ComponentFixture<AutoCollisionRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoCollisionRepairComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoCollisionRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
