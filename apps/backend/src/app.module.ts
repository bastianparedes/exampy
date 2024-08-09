import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { AiService } from './services/ai';
import { LatexService } from './services/latex';
import { ExamController } from './controllers/exam.controller';
import { DbService } from './services/db';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './services/mail.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [HealthController, ExamController, AuthController],
  providers: [AiService, LatexService, DbService, AuthService, MailService]
})
export class AppModule {}
