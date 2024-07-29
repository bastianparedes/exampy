import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { AiService } from './services/ai.service';
import { LatexService } from './services/latex.service';
import { ExamController } from './controllers/exam.controller';
import { DbService } from './services/db';

@Module({
  imports: [],
  controllers: [HealthController, ExamController],
  providers: [AiService, LatexService, DbService],
})
export class AppModule {}
