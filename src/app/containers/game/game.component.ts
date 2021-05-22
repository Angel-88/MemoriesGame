import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

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

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      let num = Math.floor(Math.random() * 10);
      this.dictionary.push(new Word('car' + num, true));
      this.dictionary.sort();
    }
    this.subscription = interval(1000)
      .subscribe(x => { this.getTimeDifference(); });
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

  private subscription!: Subscription;

  public dateNow = new Date();
  public dDay = new Date(this.dateNow.setMinutes(this.dateNow.getMinutes() + 1));
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;


  private getTimeDifference() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference: number) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}


