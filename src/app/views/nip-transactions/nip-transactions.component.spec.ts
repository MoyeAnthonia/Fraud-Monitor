import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NipTransactionsComponent } from './nip-transactions.component';

describe('NipTransactionsComponent', () => {
  let component: NipTransactionsComponent;
  let fixture: ComponentFixture<NipTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NipTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NipTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
