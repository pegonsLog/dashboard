import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  menu: any = false;

  @Output() closeSidenav: EventEmitter<boolean> = new EventEmitter();

  onOpened() {
    this.closeSidenav.emit();
  }
}
