import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule, HttpClientModule, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginObj with empty EmailId and Password', () => {
    expect(component.loginObj.EmailId).toEqual('');
    expect(component.loginObj.Password).toEqual('');
  });

  it('should call onLogin() and navigate to dashboard on successful login', fakeAsync(() => {
    const navigateSpy = spyOn((component as any).router, 'navigateByUrl');

    component.onLogin();
    const req = httpTestingController.expectOne('https://freeapi.miniprojectideas.com/api/User/Login');
    req.flush({ result: true });

    tick();

    expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
    expect(window.alert).toHaveBeenCalledWith('login Succes');
  }));

  it('should call onLogin() and show alert on failed login', fakeAsync(() => {
    const alertSpy = spyOn(window, 'alert');

    component.onLogin();
    const req = httpTestingController.expectOne('https://freeapi.miniprojectideas.com/api/User/Login');
    req.flush({ result: false, message: 'Invalid credentials' });

    tick();

    expect(alertSpy).toHaveBeenCalledWith('Invalid credentials');
  }));
});
