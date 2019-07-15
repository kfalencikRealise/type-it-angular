import { Component, OnInit } from '@angular/core';
import dictionary from '../assets/dictionary.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public gameStart: boolean = true;
  public gamePlay: boolean = false;
  public gameOver: boolean = false;
  public difficulty: string;
  public dictionary: object;
  public dictionarySize: number;
  public score: number = 0;

  ngOnInit() {
    this.dictionary = dictionary;
    this.dictionarySize = Object.keys(dictionary).length;
  }

  setDifficulty($event) {
    this.difficulty = $event.difficulty;
    this.gameStart = false;
    this.gamePlay = true;
  }

  setGameOver($event) {
    this.score = $event.score;
    this.gamePlay = false;
    this.gameOver = true;
  }
}
