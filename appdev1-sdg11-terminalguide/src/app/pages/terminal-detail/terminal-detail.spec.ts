import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalDetail } from './terminal-detail';

describe('TerminalDetail', () => {
  let component: TerminalDetail;
  let fixture: ComponentFixture<TerminalDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(TerminalDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
