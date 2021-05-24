import { Component, OnInit } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';

export class Word {
  text: string;
  isVisible: boolean;

  constructor(text: string, isVisible: boolean) {
    this.text = text;
    this.isVisible = isVisible;
  }
}

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
  dictionary: Word[] = [];
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
      this.dictionary.push(new Word('car' + num, true));
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
  }


  runStudyGame() {
    this.isStudyGameRunning = true;
  }

  runTestGame() {
    this.isTestGameRunning = true;
    this.simpleTimer.newTimer(this.timerName, 1, true);
    this.subscribeTimer();
  }

  clickToWordColumn1(word: Word) {
    console.log(word);
    this.tmp1 = word.text;
    console.log('tmp1 = ', this.tmp1);
  }

  clickToWordColumn2(word: Word) {
    this.tmp2 = word.text;
    console.log('tmp2 = ', this.tmp2);
    word.isVisible = !(this.tmp1 === this.tmp2);
    this.tmp1 = this.tmp2 = '';
    console.log(word.isVisible);

  }

  subscribeTimer() {
    if (this.timerId) {
      // Unsubscribe if timer Id is defined
      this.simpleTimer.unsubscribe(this.timerId);
      this.timerId = undefined;
      this.timerButton = 'Subscribe';
      console.log('timer 0 Unsubscribed.');
    } else {
      // Subscribe if timer Id is undefined
      this.timerId = this.simpleTimer.subscribe(this.timerName, () => this.timerCallback());
      this.timerButton = 'Unsubscribe';
      console.log('timer 0 Subscribed.');
    }
    console.log(this.simpleTimer.getSubscription());
  }

  timerCallback(): void {
    this.timerCounter--;
    if (this.timerCounter === 0) {
      this.timerCounter = 60;
      this.subscribeTimer();
    }
  }
}


