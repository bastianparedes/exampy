import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  httpClient = inject(HttpClient);
  async generatePythonFn(prompt: string) {

    const pythonFunction = await firstValueFrom(this.httpClient.post('/api/ai/generate_python_fn', { prompt }, { responseType: 'text' }));
    return pythonFunction;
  }
}
