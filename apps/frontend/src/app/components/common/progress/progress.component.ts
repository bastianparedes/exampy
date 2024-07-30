import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './progress.component.html',
})
export class ProgressComponent implements OnChanges {
  @Input({ required: true }) percentage!: number;
  @Input({ required: true }) texts!: string[];

  adecuatePercentage = NaN;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['percentage'] !== undefined) {
      this.adecuatePercentage = Math.min(
        Math.max(0, changes['percentage'].currentValue),
        100
      );
    }
  }
}
