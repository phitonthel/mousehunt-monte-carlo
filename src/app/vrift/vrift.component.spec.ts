import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VriftComponent } from './vrift.component';

describe('VriftComponent', () => {
  let component: VriftComponent;
  let fixture: ComponentFixture<VriftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VriftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VriftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
