import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DludhuComponent } from './dludhu.component';

describe('DludhuComponent', () => {
  let component: DludhuComponent;
  let fixture: ComponentFixture<DludhuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DludhuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DludhuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
