import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  //pass: FormGroup;
  // observer: Observable<any>;
  hide = true;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit(): void {}

  login() {
    this.http
      .post<{ message: string; token: Number }>(
        'http://localhost:3000/login',
        this.loginForm.value,
        this.httpOptions
      )
      .subscribe((responseData) => {
        console.log(responseData.message);
        alert(responseData.message);
        this.setLoginStatus(this.loginForm.value.email, responseData.token);
      });
  }

  setLoginStatus(user: string, token: Number) {
    localStorage.setItem('user', user);
    localStorage.setItem('token', token.toString());
    //alert('token set: ' + localStorage.getItem('token'));
  }
}
