import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  hide = true;
  registrationForm: FormGroup;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.registrationForm = this.registrationForm = this.formBuilder.group(
      {
        address: ['', Validators.required],
        postCode: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        //confirmPassword: ['', Validators.required],
      },
      {
        //NOTE: register() not called if commented validators are active (why?)
        //validator: this.MustMatch('password', 'confirmPassword'),
      }
    );
  }

  MustMatch(pass: string, conPass: string) {
    return (formGroup: FormGroup) => {
      const pwd = formGroup.controls[pass];
      const conPwd = formGroup.controls[conPass];

      if (pwd.value !== conPwd.value) {
        conPwd.setErrors({ mustMatch: true });
      } else {
        conPwd.setErrors(null);
      }
    };
  }

  register() {
    this.http
      .post<{ message: string }>(
        'http://localhost:3000/signup',
        this.registrationForm.value,
        this.httpOptions
      )
      .subscribe((responseData) => {
        console.log(responseData.message);
        alert(responseData.message);
      });
  }
}
