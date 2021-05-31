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

  selectedWord!: WordResponseDto;
  selectedTranslateWord!: WordResponseDto;
  notEqual = {isNotEqual: false, selectedWordId: '', selectedTranslateWordId: ''};
  words$!: Observable<WordResponseDto[]>;
  responseWords: WordResponseDto[] = [];
  words: WordResponseDto[] = [];
  wordsRandom: WordResponseDto[] = [];
  wordsColumns: WordResponseDto[][] = [];

  timerConfig = 60;
  timerCounter = this.timerConfig;
  timerId!: string | null;
  timerName = 'Test game';

  gameTypeEnum = GameTypeEnum;

  gameConfig!: GameConfig | null;
  score = 0;
  wordsProgress = 0;
  mistake = 0;
  sizeWordsRange = 10;
  instance!: AbstractConfig | null;
  wordsRange: WordResponseDto[] = [];
  wordsRangeStartIndex = 0;
  wordsRangeEndIndex = this.sizeWordsRange;

  gameStartTime!: number;
  gameEndTime!: number;
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
    } else {
      this.timerCounter = this.timerConfig;
    }
    this.instance = ConfigsFactory.getInstance(gameType);
    this.gameConfig = this.instance.getGameConfig();
    this.wordsColumns = [];
    this.wordsProgress = 0;
    this.score = 0;
    this.mistake = 0;
    this.wordsRangeStartIndex = 0;
  }

  runGame(): void {
    if (this.instance?.gameType === GameTypeEnum.TEST) {
      this.simpleTimer.newTimer(this.timerName, 1, true);
      this.subscribeTimer();
      this.gameStartTime = new Date().getTime();
    }
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
  }

  stopGame(): void {
    if (this.instance?.gameType === GameTypeEnum.TEST) {
      this.gameEndTime = new Date().getTime();
      this.totalGameTime = new Date(this.gameEndTime - this.gameStartTime);
      this.unsubscribeTimer();
    }
    this.instance?.setIsGameRunning(false);
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
        if (!this.wordsColumns[0].some(wordItem => wordItem.isVisible) && this.instance?.gameType === GameTypeEnum.STUDY) {
          this.wordsColumns = [];
          if (this.words.length === this.wordsRangeEndIndex) {
            this.words = this.shuffle(this.words);
            this.words.forEach(shuffleWord => shuffleWord.isVisible = true);
            this.wordsRangeStartIndex = 0;
            this.wordsRangeEndIndex = this.sizeWordsRange;
          } else {
            this.wordsRangeStartIndex += this.sizeWordsRange;
            this.wordsRangeEndIndex += this.sizeWordsRange;
          }
          const wordsRange = this.getWordsRange(this.wordsRangeStartIndex, this.wordsRangeEndIndex, this.words);
          this.wordsColumns.push(wordsRange);
          this.wordsRandom = this.shuffle(wordsRange);
          this.wordsColumns.push(this.wordsRandom);
        }
        if (!this.wordsColumns[0].some(wordItem => wordItem.isVisible) && this.instance?.gameType === GameTypeEnum.TEST) {
          this.stopGame();
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
    if (!this.timerId) {
      this.timerId = this.simpleTimer.subscribe(this.timerName, () => this.timerCallback());
    }
  }

  private unsubscribeTimer(): void {
    if (this.timerId) {
      this.simpleTimer.unsubscribe(this.timerId);
      this.timerId = null;
      this.timerCounter = this.timerConfig;
    }
  }

  private timerCallback(): void {
    this.timerCounter--;
    if (this.timerCounter === 0) {
      this.stopGame();
    }
  }

  shuffle(array: WordResponseDto[]): WordResponseDto[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
}


