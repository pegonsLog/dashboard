import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  monthBirthday: string = '';

  subscription: Subscription = new Subscription();
  @Output() birthdaySearch: EventEmitter<string> = new EventEmitter<string>();

  constructor(private router: Router) {}

  onBirthday(birthdayMonth: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: { birthday: birthdayMonth },
    };
    this.router.navigate(['birthdayList'], navigationExtras);
  }
}
