import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  @Input() dictionary: object;
  @Input() difficulty: string;
  @Input() dictionarySize: number;

  @Output() onSetGameOver = new EventEmitter<any>();

  public timer: number;
  public score: number = 0;
  public streak: number = 0;
  public streakStars: Array<number> = [];
  public wordCount: number = 0;
  public currentWord: string;
  public currentWordArray: Array<string> = [];
  public currentDesc: string;
  public currentCharacter: number = 0;
  public timerInterval: any = null;
  public superPowerInterval: any = null;
  public messageTimeout: any = null;
  public currentWordLetters: Array<string> = [];
  public dPenalty: number = 0;
  public dMultiplier: number = 0;
  public dBonus: number = 0;
  public dTimeFreeze: number = 0;
  public dStreak: number = 0;
  public explosion: boolean = false;
  public superPowerDouble: boolean = false;
  public superPowerFreeze: boolean = false;
  public message: string = '';
  public messageClass: string = '';

  constructor() { }

  ngOnInit() {
    const self = this;

    // Set difficulty
    this.setDifficulty();

    // Set timer
    this.setTimer();

    // Set first word
    this.getWord();

    // Wait for keyups
    document.addEventListener('keyup', function(e) {
      let key: string = e.key;

      if(key != '13' && key != 'return' && key != 'Enter') {
        self.checkLetter(key);
      }
    });
  }

  setDifficulty() {
    switch (this.difficulty) {
      case 'insane':
        this.timer = 15;
        this.dPenalty = 15;
        this.dMultiplier = 6;
        this.dBonus = 1.5;
        this.dTimeFreeze = 1500;
        this.dStreak = 8;
        break;

      case 'average':
        this.timer = 30;
        this.dPenalty = 10;
        this.dMultiplier = 4;
        this.dBonus = 2;
        this.dTimeFreeze = 3000;
        this.dStreak = 6;
        break;

      case 'easy':
        this.timer = 45;
        this.dPenalty = 5;
        this.dMultiplier = 2;
        this.dBonus = 3;
        this.dTimeFreeze = 5000;
        this.dStreak = 5;
        break;
    }
  }

  getWord() {
    const self = this;

    this.currentWordLetters = [];
    this.currentCharacter = 0;

    let number = Math.floor(Math.random() * this.dictionarySize);
    this.currentWord = Object.keys(this.dictionary)[number];
    this.currentWordArray = this.currentWord.split("");
    let words = Object.keys(this.dictionary).map(function(number) {
      return self.dictionary[number];
    });
    this.currentDesc = words[number];
  }

  setTimer() {
    let color: string;
    const self = this;

    this.timerInterval = setInterval(function() {
      self.timer--;

      if (self.timer <= 80) {
        color = '#46aaff';
      }
      if (self.timer <= 60) {
        color = '#99b7d0';
      }
      if (self.timer <= 40) {
        color = '#ffad16';
      }
      if (self.timer <= 20) {
        color = '#fd5e22';
      }
      if (self.timer <= 10) {
        color = '#ef3434';
      }
      if (self.timer <= 0) {
        self.setGameOver();
      }

      document.querySelector('body').style.backgroundColor = color;
    }, 1000);
  }

  setGameOver() {
    this.onSetGameOver.emit({score: this.score});
    clearInterval(this.timerInterval);
  }

  checkLetter(letter: string) {
    if (letter.toLowerCase() === this.currentWordArray[this.currentCharacter].toLowerCase()) {
      this.currentWordLetters.push(letter);
      this.goodLetter();
    } else {
      this.badLetter();
    }
  }

  goodLetter() {
    if (this.currentCharacter + 1 === this.currentWord.length) {
      this.correctWord();
    } else {
      this.currentCharacter++;
    }
  }

  badLetter() {
    this.showMessage('<p>-' + this.dPenalty + 's</p>', 'bad');
    this.timer = this.timer - this.dPenalty;
    this.streak = 0;
    this.streakStars = [];
    this.superPowerFreeze = false;
    this.superPowerDouble = false;

    this.getWord();
  }

  showMessage(text: string, textClass: string) {
    clearTimeout(this.messageTimeout);
    const self = this;

    this.message = text;
    this.messageClass = textClass;
    this.messageTimeout = setTimeout(function() {
      self.message = '';
    }, 2000);
  }

  correctWord() {
    const self = this;
    this.wordCount++;

    let time: number = Math.floor(this.currentWordArray.length / this.dMultiplier) + 1;
    this.timer = this.timer + time;

    let points = 0;
    if (this.superPowerDouble) {
      points = Math.floor(this.currentWordArray.length / this.dMultiplier) * 400;
    } else {
      points = Math.floor(this.currentWordArray.length / this.dMultiplier) * 200;
    }
    this.score = points + this.score;

    this.streak++;
    this.streakStars.push(this.streak);

    this.showMessage('<p>+' + points + ' points, +' + time + 's</p>', 'good');

    // If streak finished get a super power
    if (this.streak === this.dStreak) {
      let number = Math.floor(Math.random() * 3);
      this.streak = 0;
      this.streakStars = [];

      // Explosion effect
      this.explosion = true;

      setTimeout(function() {
        self.explosion = false;
      }, 1000)

      if (number == 1) {
        this.superPowerDouble = true;
        clearTimeout(this.superPowerInterval);

        // For limited time add bonus points to score
        this.superPowerInterval = setTimeout(function() {
          self.superPowerDouble = false;
        },  self.dTimeFreeze);
      } else {
        this.superPowerFreeze = true;
        clearInterval(this.timerInterval);
        clearTimeout(this.superPowerInterval);

         // Freeze timer for a while
        this.superPowerInterval = setTimeout(function() {
          self.setTimer();
          self.superPowerFreeze = false;
        },  self.dTimeFreeze);
      }
    }

    this.getWord();
  }
}
