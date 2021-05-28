import { Component, OnInit } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';
import { WordRequestDto } from '../../rest/words/word.request.dto';

@Component({
  templateUrl: './game.html',
  styleUrls: [ './game.scss' ],
})
export class GameComponent implements OnInit {
  isStudyGameStarted = false;
  isTestGameStarted = false;
  isStudyGameRunning = false;
  isTestGameRunning = false;
  score = 0;
  dictionary: WordRequestDto[] = [];
  tmp1 = '';
  tmp2 = '';
  compare = false;

  timerCounter = 60;
  timerId?: string;
  timerName: string = '60 sec';
  timerButton = 'Start';

  constructor(private readonly simpleTimer: SimpleTimer) {}

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      let num = Math.floor(Math.random() * 10);
      const word: WordRequestDto =  {word:'car'+ num,isVisible: true, translateWord: 'автомобіль'};
      this.dictionary.push(new WordRequestDto(word));
      this.dictionary.sort();
    }
  }

  startStudyGame() {
    this.isStudyGameStarted = true;
  }

  stopStudyGame() {
    this.isStudyGameStarted = false;
    this.isStudyGameRunning = false;
  }

  startTestGame() {
    this.isTestGameStarted = true;
  }

  stopTestGame() {
    this.isTestGameStarted = false;
    this.isTestGameRunning = false;
    this.subscribeTimer();
  }

  runStudyGame() {
    this.isStudyGameRunning = true;
  }

  runTestGame() {
    this.isTestGameRunning = true;
    this.simpleTimer.newTimer(this.timerName, 1, true);
    this.subscribeTimer();
  }

  clickToWordColumn1(word: WordRequestDto) {
    console.log(word);
    this.tmp1 = word.word;
    console.log('tmp1 = ', this.tmp1);
  }

  clickToWordColumn2(word: WordRequestDto) {
    this.tmp2 = word.word;
    console.log('tmp2 = ', this.tmp2);
    word.isVisible = !(this.tmp1 === this.tmp2);
    this.tmp1 = this.tmp2 = '';
    console.log(word.isVisible);
  }

  private subscribeTimer() {
    if (this.timerId) {
      // Unsubscribe if timer Id is defined
      this.simpleTimer.unsubscribe(this.timerId);
      this.timerId = undefined;
      this.timerButton = 'Start';
      this.timerCounter = 60;
      console.log('timer 0 Unsubscribed.');
    } else {
      // Subscribe if timer Id is undefined
      this.timerId = this.simpleTimer.subscribe(this.timerName, () => this.timerCallback());
      this.timerButton = 'Finish';
      console.log('timer 0 Subscribed.');
    }
    console.log(this.simpleTimer.getSubscription());
  }

  private timerCallback(): void {
    this.timerCounter--;
    if (this.timerCounter === 0) {
      this.timerCounter = 60;
      this.subscribeTimer();
    }
  }
}


