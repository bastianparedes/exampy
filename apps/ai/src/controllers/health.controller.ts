import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthController {
  @Get()
  async getHello() {
    return 'ok';
  }
}
