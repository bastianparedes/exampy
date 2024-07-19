import { Injectable, Inject } from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { PythonService } from './python.service';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

@Injectable()
export class AiService {
  @Inject(EnvironmentService)
  readonly environmentService = new EnvironmentService();

  @Inject(PythonService)
  readonly pythonService = new PythonService();

  async getPrompt(input: string) {
    const headerCode = await this.pythonService.getHeaderCode();
    const examples = await this.pythonService.getExamples(5);

    const completePrompt = [
      'Tengo una aplicación escrita en Python que utiliza las siguientes clases y módulos.',
      '',
      headerCode,
      '',
      'Esta aplicación tiene por objetivo recibir códigos python de los clientes, los cuales usando sympy generan código LaTeX que constituyen ejercicios de selección múltiple.',
      `A continuación te muestro ${examples.length} ejemplos de código Python que construyen ejercicios.`,
      '',
      '',
      examples.join('\n\n'),
      '',
      '',
      'Quiero que me des otro código python que construya el siguiente tipo de ejercicio:',
      'Debes entregarme solo la función fn con su decorador, nada mas.',
      'No desordenes "alternatives_texts" ni "alternatives_identifiers", ya que lo haré yo después.',
      'Debe poder generar por lo menos 5 resultados con "question_identifiers" diferentes.',
      input,
    ].join('\n');

    const response = await generateText({
      model: google('models/gemini-1.5-pro-latest'),
      prompt: completePrompt,
      maxTokens: 20000,
      temperature: 0.2,
      maxRetries: 5,
    });

    const match = response.text.match(/```python\n([\s\S]*?)\n```/); // Esto es necesario ya que google devuelve un markdown
    if (match !== null) {
      return match[1];
    } else {
      return response.text;
    }
  }
}
