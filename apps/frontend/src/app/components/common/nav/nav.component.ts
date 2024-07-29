import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth.service'
import { TranslateModule } from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatProgressSpinnerModule, TranslateModule, MatIconModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  auth = inject(AuthService);
  isOpen = false;

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
