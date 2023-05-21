import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafnodedetailsComponent } from './leafnodedetails.component';

describe('LeafnodedetailsComponent', () => {
  let component: LeafnodedetailsComponent;
  let fixture: ComponentFixture<LeafnodedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeafnodedetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeafnodedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
