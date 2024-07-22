import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, MatProgressSpinnerModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  auth = inject(AuthService);
}
