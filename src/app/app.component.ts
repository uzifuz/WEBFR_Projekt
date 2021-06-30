import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'WEBFR-Projekt';
  public logout() {
    if (localStorage.getItem('user') == null) {
      alert('already logged out!');
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  isLoggedIn() {
    if (localStorage.getItem('user') != null) {
      return true;
    } else {
      return false;
    }
  }
}
