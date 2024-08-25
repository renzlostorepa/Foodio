import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RistoratoreComponent } from './ristoratore.component';

describe('RistoratoreComponent', () => {
  let component: RistoratoreComponent;
  let fixture: ComponentFixture<RistoratoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RistoratoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RistoratoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
