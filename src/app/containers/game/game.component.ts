import {Component, OnInit} from '@angular/core';
import {WordResponseDto} from '../../rest/words/word.response.dto';
import {Observable} from 'rxjs';
import {WordsService} from '../../rest/words/words.service';
import {GameFactory} from './configs/game-factory';
import {GameTypeEnum} from './shared/enums/game-type.enum';
import {Game} from './configs/game';

export class GameConfig {
  statisticConfig!: string[];
}

@Component({
  templateUrl: './game.html',
  styleUrls: ['./game.scss'],
})
export class GameComponent implements OnInit {

  words$!: Observable<WordResponseDto[]>;
  responseWords: WordResponseDto[] = [];

  gameTypeEnum = GameTypeEnum;

  gameInstance!: Game;

  isGameConfigShow = true;

  constructor(private readonly wordsService: WordsService) {}

  ngOnInit(): void {
    this.initWords();
  }

  initGame(gameType: GameTypeEnum): void {
    this.gameInstance = GameFactory.getInstance(gameType);
    this.gameInstance.isGameSectionShow = true;
    this.gameInstance.isGameConfigShow = false;
    this.isGameConfigShow = false;
  }


  runGame(): void {
    this.gameInstance?.runGame(this.responseWords);
    this.gameInstance.isGameRunning = true;
  }

  private initWords(): void {
    this.words$ = this.wordsService.getWords();
    this.words$.subscribe(responseWords => {
      this.responseWords = responseWords.map(word => new WordResponseDto(word));
    });
  }
}


