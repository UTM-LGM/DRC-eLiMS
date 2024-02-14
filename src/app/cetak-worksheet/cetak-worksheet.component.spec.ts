import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CetakWorksheetComponent } from './cetak-worksheet.component';

describe('CetakWorksheetComponent', () => {
  let component: CetakWorksheetComponent;
  let fixture: ComponentFixture<CetakWorksheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CetakWorksheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CetakWorksheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
