import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.scss']
})
export class DayListComponent {

  constructor(){
    
  }
  displayedColumns: string[] = ['registration', 'startDay', 'endDay', 'mode'];
  dataSource = new MatTableDataSource([
    { id: '1', registration: '564', startDay: '22/05/2023', endDay: '25/05/2023', mode: 'Comparecimento' },
    { id: '2', registration: '410', startDay: '23/05/2023', endDay: '29/05/2023', mode: 'Acompanhamento'}
  ]);

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
