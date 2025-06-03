import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDataPage } from './change-data.page';

describe('ChangeDataPage', () => {
  let component: ChangeDataPage;
  let fixture: ComponentFixture<ChangeDataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
