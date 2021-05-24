import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UsersHomeComponent } from './user.home.component';


describe('HomeComponent', () => {
  let component: UsersHomeComponent;
  let fixture: ComponentFixture<UsersHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ RouterTestingModule ],
        declarations: [ UsersHomeComponent ],
        providers: [  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
