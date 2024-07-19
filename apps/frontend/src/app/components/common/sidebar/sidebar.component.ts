import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  auth = inject(AuthService);
}
