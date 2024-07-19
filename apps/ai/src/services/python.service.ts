import { Injectable, Inject } from '@nestjs/common';
import { EnvironmentService } from './environment.service';

@Injectable()
export class PythonService {
  @Inject(EnvironmentService)
  readonly environmentService = new EnvironmentService();

  readonly pythonOrigin = this.environmentService.isProduction
    ? 'https://exampy-python.vercel.app'
    : 'http://python:5000';

  async getExamples(quantity: number) {
    const response = await fetch(
      `${this.pythonOrigin}/examples?quantity=${Number(quantity)}`,
    );
    const codes: {
      examples: string[];
    } = await response.json();
    return codes.examples;
  }

  async getHeaderCode() {
    const response = await fetch(`${this.pythonOrigin}/header_code`);
    const code = await response.text();
    return code;
  }

  async getHeaderCodeSimplified() {
    const response = await fetch(`${this.pythonOrigin}/header_code_simplified`);
    const code = await response.text();
    return code;
  }
}
