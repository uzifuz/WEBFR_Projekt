import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  email: string;
  address: string;
  highscore: number;
  postCode: number;
  ngOnInit(): void {
    if (localStorage.getItem('token') == null) {
      alert('not logged in!');
      return;
    }
    const geturl =
      'http://localhost:3000/profile?email=' +
      localStorage.getItem('user') +
      '&token=' +
      localStorage.getItem('token');
    this.http
      .get<{
        message: string;
        email: string;
        highscore: number;
        address: string;
        postCode: number;
      }>(geturl)
      .subscribe((responseData) => {
        this.email = responseData.email;
        this.address = responseData.address;
        this.highscore = responseData.highscore;
        this.postCode = responseData.postCode;
        //alert(responseData.email);
      });
  }
}
