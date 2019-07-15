import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-start-dialog',
  templateUrl: './game-start-dialog.component.html',
  styleUrls: ['./game-start-dialog.component.scss']
})

export class GameStartDialogComponent {
  @Output() onSetDifficulty = new EventEmitter<any>();

  setDifficulty(difficulty: string) {
    this.onSetDifficulty.emit({difficulty});
  }
}
