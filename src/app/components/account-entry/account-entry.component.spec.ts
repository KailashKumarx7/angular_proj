import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEntryComponent } from './account-entry.component';

describe('AccountEntryComponent', () => {
  let component: AccountEntryComponent;
  let fixture: ComponentFixture<AccountEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountEntryComponent]
    });
    fixture = TestBed.createComponent(AccountEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
