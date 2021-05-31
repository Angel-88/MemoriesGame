import {Component, OnInit} from '@angular/core';
import {SimpleTimer} from 'ng2-simple-timer';
import {WordResponseDto} from '../../rest/words/word.response.dto';
import {Observable} from 'rxjs';
import {WordsService} from '../../rest/words/words.service';
import {ConfigsFactory} from './configs/configs-factory';
import {GameTypeEnum} from './shared/enums/game-type.enum';
import {AbstractConfig} from './configs/abstract-config';

export class GameConfig {
  statisticConfig!: string[];
}

@Component({
  templateUrl: './game.html',
  styleUrls: ['./game.scss'],
})
export class GameComponent implements OnInit {
  score = 0;
  selectedWord!: WordResponseDto;
  selectedTranslateWord!: WordResponseDto;
  notEqual = {isNotEqual: false, selectedWordId: '', selectedTranslateWordId: ''};
  words$!: Observable<WordResponseDto[]>;
  responseWords: WordResponseDto[] = [];
  words: WordResponseDto[] = [];
  wordsRandom: WordResponseDto[] = [];
  wordsColumns: WordResponseDto[][] = [];

  timerCounter = 60;
  timerId!: string | null;
  timerName = '60 sec';
  timerButton = 'Start';
  gameTypeEnum = GameTypeEnum;

  gameConfig!: GameConfig | null;
  wordsProgress = 0;
  mistake = 0;
  instance!: AbstractConfig | null;
  wordsRange: WordResponseDto[] = [];
  wordsRangeStartIndex = 0;
  sizeWordsRange = 10;
  wordsRangeEndIndex = this.sizeWordsRange;

  startGameTime!: number;
  endGameTime!: number;
  totalGameTime!: Date;

  isModalShow = false;

  constructor(private readonly simpleTimer: SimpleTimer,
              private readonly wordsService: WordsService) {}

  ngOnInit(): void {
    this.initWords();
  }

  initGame(gameType: GameTypeEnum): void {
    if (gameType === GameTypeEnum.STUDY) {
      this.timerCounter = 9999;
    }
    this.instance = ConfigsFactory.getInstance(gameType);
    this.gameConfig = this.instance.getGameConfig();
  }

  runGame(): void {
    this.wordsColumns = [];
    this.wordsProgress = 0;
    this.score = 0;
    this.mistake = 0;
    this.wordsRangeStartIndex = 0;
    this.wordsRangeEndIndex = this.sizeWordsRange;
    this.words = this.shuffle(this.responseWords).map(word => new WordResponseDto(word));
    const wordsRange = this.getWordsRange(this.wordsRangeStartIndex, this.wordsRangeEndIndex, this.words);
    this.wordsColumns.push(wordsRange);
    this.wordsRandom = this.shuffle(wordsRange);
    this.wordsColumns.push(this.wordsRandom);
    this.instance?.setIsGameRunning(true);
    this.simpleTimer.newTimer(this.timerName, 1, true);
    this.subscribeTimer();
    this.startGameTime = new Date().getTime();
  }

  stopGame(): void {
    this.endGameTime = new Date().getTime();
    this.totalGameTime = new Date(this.endGameTime - this.startGameTime);
    this.instance?.setIsGameRunning(false);
    this.subscribeTimer();
    this.gameConfig = null;
    this.wordsColumns = [];
    this.isModalShow = true;
  }

  getWordsRange(startIndex: number, endIndex: number, array: WordResponseDto[]): WordResponseDto[] {
    return array.slice(startIndex, endIndex);
  }

  clickToWord(columnIndex: number, word: WordResponseDto): void {
    if (columnIndex === 0) {
      this.selectedWord = word;
    } else {
      this.selectedTranslateWord = word;
      const equal = this.selectedWord.id === this.selectedTranslateWord.id;
      if (equal) {
        this.wordsProgress++;
        this.score++;
      } else {
        this.mistake++;
      }
      this.notEqual.isNotEqual = !equal;
      this.notEqual.selectedWordId = this.selectedWord.id;
      this.notEqual.selectedTranslateWordId = this.selectedTranslateWord.id;
      setTimeout(() => {
        word.isVisible = !equal;
        this.notEqual = {isNotEqual: false, selectedWordId: '', selectedTranslateWordId: ''};
        if (this.wordsProgress === this.sizeWordsRange) {
          this.wordsProgress = 0;
          this.wordsColumns = [];
          const wordsRange = this.getWordsRange(this.wordsRangeStartIndex += this.sizeWordsRange,
            this.wordsRangeEndIndex += this.sizeWordsRange, this.words);
          this.wordsColumns.push(wordsRange);
          this.wordsRandom = this.shuffle(wordsRange);
          this.wordsColumns.push(this.wordsRandom);
        }
      }, 300);
      this.selectedWord = this.selectedTranslateWord = {word: '', translateWord: '', id: '', isVisible: false};
    }
  }

  private initWords(): void {
    this.words$ = this.wordsService.getWords();
    this.words$.subscribe(responseWords => {
      this.responseWords = responseWords;
      this.responseWords = this.responseWords.map(word => new WordResponseDto(word));
    });
  }

  private subscribeTimer(): void {
    if (this.timerId) {
      this.simpleTimer.unsubscribe(this.timerId);
      this.timerId = null;
      this.timerButton = 'Start';
      this.timerCounter = 60;
    } else {
      this.timerId = this.simpleTimer.subscribe(this.timerName, () => this.timerCallback());
      this.timerButton = 'Finish';
    }
  }

  private timerCallback(): void {
    this.timerCounter--;
    if (this.timerCounter === 0) {
      this.stopGame();
      this.timerCounter = 60;
      this.subscribeTimer();
    }
  }

  shuffle(array: WordResponseDto[]): WordResponseDto[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
}


