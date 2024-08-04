import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [],
  templateUrl: './date.component.html'
})
export class DateComponent implements OnInit {
  @Input({ required: true }) stringDate!: string;

  formattedStringDate = '';

  ngOnInit() {
    this.formattedStringDate = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(this.stringDate));
  }
}
