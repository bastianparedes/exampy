import { Controller, Get, Post, /* Req, */ Inject } from '@nestjs/common';
// import type { FastifyRequest } from 'fastify';
import { EnvironmentService } from '../services/environment.service';
import { PythonService } from '../services/python.service';

@Controller('/example')
export class ExampleController {
  @Inject(EnvironmentService)
  readonly environmentService = new EnvironmentService();

  @Inject(PythonService)
  readonly pythonService = new PythonService();

  @Get()
  async getHello(/* @Req() request: FastifyRequest */) {
    // const { cookies, headers } = request;
    return await this.pythonService.getExamples(3);
  }

  @Post()
  PostHello(/* @Req() request: FastifyRequest */) {
    // const { body } = request;
    return 'Hello World!';
  }
}
