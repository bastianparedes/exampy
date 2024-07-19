import {
  Controller,
  Inject,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AiService } from '../services/ai.service';

@Controller('generate_python_fn')
export class GeneratePythonFnController {
  @Inject(AiService)
  aiService = new AiService();

  @Post()
  async PostGeneratePythonFn(@Body('prompt') prompt: unknown) {
    if (typeof prompt !== 'string')
      throw new BadRequestException(
        'Prompt must be in body and must be in body',
      );
    return await this.aiService.getPrompt(prompt);
  }
}
