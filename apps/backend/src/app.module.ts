import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { HealthController } from './controllers/health.controller';
import { AiService } from './services/ai.service';
import { AuthController } from './controllers/auth.controller';
import { LatexService } from './services/latex.service';
import { ExamController } from './controllers/exam.controller';
import { DbService } from './services/db';

@Module({
  imports: [],
  controllers: [HealthController, AuthController, ExamController],
  providers: [AuthService, AiService, LatexService, DbService],
})
export class AppModule {}
