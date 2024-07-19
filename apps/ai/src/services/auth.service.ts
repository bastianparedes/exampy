import { Injectable, Inject } from '@nestjs/common';
import { EnvironmentService } from './environment.service';

@Injectable()
export class AuthService {
  @Inject(EnvironmentService)
  readonly environmentService = new EnvironmentService();

  readonly authOrigin = this.environmentService.isProduction
    ? 'https://exampy-python.vercel.app'
    : 'http://python:5000';

  async getUserData() {
    const response = await fetch(`${this.authOrigin}/user_data`);
    const code = await response.text();
    return code;
  }
}
