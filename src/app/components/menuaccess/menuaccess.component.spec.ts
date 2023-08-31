import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuaccessComponent } from './menuaccess.component';

describe('MenuaccessComponent', () => {
  let component: MenuaccessComponent;
  let fixture: ComponentFixture<MenuaccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuaccessComponent]
    });
    fixture = TestBed.createComponent(MenuaccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
