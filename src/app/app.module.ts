import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameStartDialogComponent } from './components/game-start-dialog/game-start-dialog.component';
import { GameOverDialogComponent } from './components/game-over-dialog/game-over-dialog.component';
import { GameBoardComponent } from './components/game-board/game-board.component';

@NgModule({
  declarations: [
    AppComponent,
    GameStartDialogComponent,
    GameOverDialogComponent,
    GameBoardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
