import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabNpsComponent } from './tab-nps.component';

describe('TabNpsComponent', () => {
  let component: TabNpsComponent;
  let fixture: ComponentFixture<TabNpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabNpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabNpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
