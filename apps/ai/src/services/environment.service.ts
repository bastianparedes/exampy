import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentService {
  readonly NODE_ENV = process.env.NODE_ENV ?? 'production';
  readonly ADDRESS = process.env.ADDRESS ?? '127.0.0.1';
  readonly GOOGLE_GENERATIVE_AI_API_KEY =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  readonly isProduction = this.NODE_ENV === 'production';
}
