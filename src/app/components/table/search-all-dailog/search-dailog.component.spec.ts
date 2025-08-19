import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDailogComponent } from './search-dailog.component';

describe('SearchDailogComponent', () => {
  let component: SearchDailogComponent;
  let fixture: ComponentFixture<SearchDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchDailogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
