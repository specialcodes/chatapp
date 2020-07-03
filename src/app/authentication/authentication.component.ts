import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  loggingIn: Boolean;
  success: String;
  error: String;
  usernameAvailable: Boolean;
  checkingUsername: Boolean;
  signingUp: Boolean;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService,
    private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })

    this.signupForm.get('username').valueChanges.pipe(
      debounceTime(600),
      tap(value => console.log('Searching for: ', value))
    ).subscribe(data => {
      this.checkingUsername = true;
      this.apiService.checkUsernameAvailability(data).subscribe(
        data => {
          this.checkingUsername = false;
          if (data.success) {
            if (data.data.usernameAvailable) {
              console.log('Username available')
              this.usernameAvailable = true;
            } else {
              console.log('Username not available')
              this.usernameAvailable = false;
            }
          }
        },
        error => {
          this.checkingUsername = false;
          this.showErrorMessage("Connection Problem", 2000);
        }
      )
    })
  }

  login() {
    if (this.loginForm.valid) {
      this.loggingIn = true;
      this.apiService.login(this.loginForm.value).subscribe(
        data => {
          if (data.success) {
            this.success = data.data.msg;
            localStorage.setItem('token', data.data.token);
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            })
          } else {
            this.loggingIn = false;
            this.showErrorMessage(data.data.msg, 2000);
          }
        },
        error => {
          this.loggingIn = false;
          this.showErrorMessage("Connection Problem", 2000);
        }
      )
    }
  }

  signup() {
    if (this.signupForm.valid) {
      if (this.usernameAvailable) {
        if (this.signupPassword.value === this.signupConfirmPassword.value) {
          this.signingUp = true;
          this.apiService.signup(this.signupForm.value).subscribe(
            data => {
              if (data.success) {
                this.success = data.data.msg;
                setTimeout(() => {
                  window.location.reload();
                }, 2000, this);
              } else {
                this.signingUp = false;
                this.error = data.data.msg;
                setTimeout(() => {
                  this.error = null;
                }, 3000, this);
              }
            },
            error => {
              this.signingUp = false;
              this.showErrorMessage("Connection Problem", 2000);
            }
          )
        } else {
          this.showErrorMessage("Passwords do not match", 2000);
        }
      } else {
        this.showErrorMessage("Choose a different username", 2000);
      }
    }
  }

  get loginUsername(): AbstractControl {
    return this.loginForm.get('username');
  }

  get loginPassword(): AbstractControl {
    return this.loginForm.get('password');
  }

  get signupUsername(): AbstractControl {
    return this.signupForm.get('username');
  }

  get signupPassword(): AbstractControl {
    return this.signupForm.get('password');
  }

  get signupConfirmPassword(): AbstractControl {
    return this.signupForm.get('confirmPassword');
  }

  showErrorMessage(message: String, duration: number) {
    this.error = message;
    setTimeout(() => {
      this.error = null;
    }, duration, this);
  }

}