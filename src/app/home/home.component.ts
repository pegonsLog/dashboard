import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isDay: boolean = true;
  isHour: boolean = false;
  isDonation: boolean = false;

  titleName: string = 'BEM VINDO!';

  constructor() {}

  onType(option: string) {
    if (option === 'day') {
      this.isDay = true;
      this.isHour = false;
      this.isDonation = false
      this.titleName = 'ATESTADO DE DIA';
    }
    if (option === 'hour') {
      this.isDay = false;
      this.isHour = true;
      this.isDonation = false;
      this.titleName = 'ATESTADO DE HORA';
    }
    if (option === 'donation') {
      this.isDay = false;
      this.isHour = false;
      this.isDonation = true;
      this.titleName = 'ATESTADO DE DOAÇÃO DE SANGUE';
    }
  }

  ngOnInit(): void {}
}
