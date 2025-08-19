import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLocalDailogComponent } from './search-local-dailog.component';

describe('SearchLocalDailogComponent', () => {
  let component: SearchLocalDailogComponent;
  let fixture: ComponentFixture<SearchLocalDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchLocalDailogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchLocalDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
