import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm, SelectMultipleControlValueAccessor } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css'],
})
export class ScoreComponent implements OnInit {
  
  public userScores : Score[] = [];

  constructor(private http: HttpClient) {
    this.fetchScore();
    
  }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  ngOnInit(): void {}

  fetchScore(){
    let jsonObj;
  let scoreData = new Array();
    this.http
    .get<{ message: string }>("http://localhost:3000/highscore").subscribe((res) =>{
      jsonObj = JSON.stringify(res);
      console.log(jsonObj);
      scoreData = JSON.parse(jsonObj);

      scoreData.forEach(data => {
        console.log(data);
      if(!isNaN(data['score'])){
        this.userScores.push(new Score(data['email'], data['score']));
      }
      });
      
      this.ConvertInToDescendingOrder();
    });  
  }

  private ConvertInToDescendingOrder(){
    this.userScores.sort((x, y) => (y.UserScore) - (x.UserScore));
  }
}

class Score {

  private userEmail :string;
  private userScore: number;

  constructor(email, score) {
    this.userEmail = email;
    this.userScore = score;
  }
  
  public get UserEmail() : string {
    return this.userEmail;
  }
  
  public get UserScore() : number {
    return this.userScore;
  }
}
