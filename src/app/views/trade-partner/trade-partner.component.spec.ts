import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradePartnerComponent } from './trade-partner.component';

describe('TradePartnerComponent', () => {
  let component: TradePartnerComponent;
  let fixture: ComponentFixture<TradePartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradePartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradePartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
