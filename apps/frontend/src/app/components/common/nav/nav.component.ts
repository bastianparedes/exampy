import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [TranslateModule, ButtonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  isOpen = false;

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
