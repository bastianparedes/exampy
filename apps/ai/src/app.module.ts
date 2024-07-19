import { Module } from '@nestjs/common';
import { ExampleController } from './controllers/example.controller';
import { EnvironmentService } from './services/environment.service';
import { PythonService } from './services/python.service';
import { AuthService } from './services/auth.service';
import { HealthController } from './controllers/health.controller';
import { AiService } from './services/ai.service';
import { GeneratePythonFnController } from './controllers/generate-python-fn.controller';

@Module({
  imports: [],
  controllers: [
    ExampleController,
    HealthController,
    GeneratePythonFnController,
  ],
  providers: [EnvironmentService, PythonService, AuthService, AiService],
})
export class AppModule {}
