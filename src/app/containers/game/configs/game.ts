// tslint:disable:variable-name
import {GameTypeEnum} from '../shared/enums/game-type.enum';
import {WordResponseDto} from '../../../rest/words/word.response.dto';

export abstract class Game {

  readonly abstract gameType: GameTypeEnum;

  wordsColumns: WordResponseDto[][] = [];
  words: WordResponseDto[] = [];

  timerCounter!: number;
  private _totalGameTime!: Date;
  private _score = 0;
  private _wordsProgress = 0;
  private _mistake = 0;
  private readonly _sizeWordsRange = 10;

  protected wordsRangeStartIndex = 0;
  protected wordsRangeEndIndex = this._sizeWordsRange;

  get score(): number {
    return this._score;
  }

  get wordsProgress(): number {
    return this._wordsProgress;
  }

  get mistake(): number {
    return this._mistake;
  }

  get sizeWordsRange(): number {
    return this._sizeWordsRange;
  }

  get totalGameTime(): Date {
    return this._totalGameTime;
  }

  selectedWord!: WordResponseDto | null;
  selectedTranslateWord!: WordResponseDto | null;
  equalingWords = {isWordsEqual: true, selectedWordId: '', selectedTranslateWordId: ''};

  isGameConfigShow = false;
  isModalShow = false;
  isGameRunning = false;
  isGameSectionShow = false;

  protected getWordsRange(startIndex: number, endIndex: number, array: WordResponseDto[]): WordResponseDto[] {
    return array.slice(startIndex, endIndex);
  }

  abstract checkType(gameType: GameTypeEnum): boolean;

  runGame(words: WordResponseDto[]): void {
    this.words = words;
    this.isGameConfigShow = false;
    const shuffledWords = this.shuffle(words).map(word => new WordResponseDto(word));
    const wordsRange = this.getWordsRange(this.wordsRangeStartIndex, this.wordsRangeEndIndex, shuffledWords);
    this.initWordsColumns(wordsRange);
  }

  stopGame(): void {
    this.wordsColumns = [];
    this.isModalShow = true;
    this.isGameRunning = false;
    this.isGameSectionShow = false;
  }

  resetGame(): void {
    this.isModalShow = false;
    this.isGameConfigShow = true;
    this.resetAllGameVariables();
  }

  protected initWordsColumns(wordsRange: WordResponseDto[]): void {
    this.wordsColumns.push(wordsRange);
    const wordsRandom = this.shuffle(wordsRange);
    this.wordsColumns.push(wordsRandom);
  }

  selectWord(columnIndex: number, word: WordResponseDto): void {
    if (columnIndex === 0) {
      this.selectedWord = word;
    } else {
      this.selectedTranslateWord = word;
      this.compareSelectedWords();
      setTimeout(() => {
        this.callbackAfterSelectWord(word);
      }, 300);
      this.selectedWord = this.selectedTranslateWord = null;
    }
  }

  protected callbackAfterSelectWord(word: WordResponseDto): void {
    word.isVisible = !this.equalingWords.isWordsEqual;
    this.equalingWords = {isWordsEqual: true, selectedWordId: '', selectedTranslateWordId: ''};
  }

  protected shuffle(array: WordResponseDto[]): WordResponseDto[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  private resetAllGameVariables(): void {
    this.wordsColumns = [];
    this._wordsProgress = 0;
    this._score = 0;
    this._mistake = 0;
    this.wordsRangeStartIndex = 0;
    this.wordsRangeEndIndex = this._sizeWordsRange;
  }

  private compareSelectedWords(): void {
    const equal = this.selectedWord?.id === this.selectedTranslateWord?.id;
    if (equal) {
      this._wordsProgress++;
      this._score++;
    } else {
      this._mistake++;
    }
    this.equalingWords.isWordsEqual = equal;
    this.equalingWords.selectedWordId = this.selectedWord?.id as string;
    this.equalingWords.selectedTranslateWordId = this.selectedTranslateWord?.id as string;
  }
}
