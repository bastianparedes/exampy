import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  cookieName = 'access_token';
}
