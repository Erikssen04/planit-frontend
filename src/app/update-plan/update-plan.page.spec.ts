import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePlanPage } from './update-plan.page';

describe('UpdatePlanPage', () => {
  let component: UpdatePlanPage;
  let fixture: ComponentFixture<UpdatePlanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
