import {GameTypeEnum} from '../shared/enums/game-type.enum';
import {WordResponseDto} from '../../../rest/words/word.response.dto';

export abstract class Game {

  abstract gameType: GameTypeEnum;
  timerCounter!: number;
  totalGameTime!: Date;

  wordsColumns: WordResponseDto[][] = [];
  words: WordResponseDto[] = [];

  score = 0;
  wordsProgress = 0;
  mistake = 0;
  sizeWordsRange = 4;
  wordsRangeStartIndex = 0;
  wordsRangeEndIndex = this.sizeWordsRange;

  selectedWord!: WordResponseDto;
  selectedTranslateWord!: WordResponseDto;
  equalingWords = {isWordsEqual: true, selectedWordId: '', selectedTranslateWordId: ''};

  isGameConfigShow = false;
  isModalShow = false;
  isGameRunning = false;
  isGameSectionShow = false;

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
    this.resetAllGameVariable();
  }

  initWordsColumns(wordsRange: WordResponseDto[]): void {
    this.wordsColumns.push(wordsRange);
    const wordsRandom = this.shuffle(wordsRange);
    this.wordsColumns.push(wordsRandom);
  }

  getWordsRange(startIndex: number, endIndex: number, array: WordResponseDto[]): WordResponseDto[] {
    return array.slice(startIndex, endIndex);
  }

  selectWord(columnIndex: number, word: WordResponseDto): void {
    if (columnIndex === 0) {
      this.selectedWord = word;
    } else {
      this.selectedTranslateWord = word;
      this.compareSelectedWords();
      this.selectedWord = this.selectedTranslateWord;
      this.selectedWord = this.selectedTranslateWord = new WordResponseDto();
      setTimeout(() => {
        word.isVisible = !this.equalingWords.isWordsEqual;
        this.equalingWords = {isWordsEqual: true, selectedWordId: '', selectedTranslateWordId: ''};
      }, 300);
      setTimeout(() => {
        if (!this.wordsColumns[0].some(wordItem => wordItem.isVisible) && this.gameType === GameTypeEnum.STUDY) {
          this.wordsColumns = [];
          if (this.words.length <= this.wordsRangeEndIndex) {
            this.words = this.shuffle(this.words);
            this.words.forEach(shuffleWord => shuffleWord.isVisible = true);
            this.wordsRangeStartIndex = 0;
            this.wordsRangeEndIndex = this.sizeWordsRange;
          } else {
            this.wordsRangeStartIndex += this.sizeWordsRange;
            this.wordsRangeEndIndex += this.sizeWordsRange;
          }
          const wordsRange = this.getWordsRange(this.wordsRangeStartIndex, this.wordsRangeEndIndex, this.words);
          this.initWordsColumns(wordsRange);
        }
        if (!this.wordsColumns[0].some(wordItem => wordItem.isVisible) && this.gameType === GameTypeEnum.TEST) {
          this.stopGame();
        }
      }, 300);
      this.selectedWord = this.selectedTranslateWord = {word: '', translateWord: '', id: '', isVisible: false};
    }
  }

  private shuffle(array: WordResponseDto[]): WordResponseDto[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  private resetAllGameVariable(): void {
    this.wordsColumns = [];
    this.wordsProgress = 0;
    this.score = 0;
    this.mistake = 0;
    this.wordsRangeStartIndex = 0;
    this.wordsRangeEndIndex = this.sizeWordsRange;
  }

  private compareSelectedWords(): void {
    const equal = this.selectedWord.id === this.selectedTranslateWord.id;
    if (equal) {
      this.wordsProgress++;
      this.score++;
    } else {
      this.mistake++;
    }
    this.equalingWords.isWordsEqual = equal;
    this.equalingWords.selectedWordId = this.selectedWord.id;
    this.equalingWords.selectedTranslateWordId = this.selectedTranslateWord.id;
  }
}
