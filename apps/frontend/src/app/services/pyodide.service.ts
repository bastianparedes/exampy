/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { FilteredColumnsByArray } from '../../types/dictionary';
import { environment } from '../../environments/environment';
import type { loadPyodide as LoadPyodide } from 'pyodide';
import { getPromise } from '../utils/promise';

declare global {
  // eslint-disable-next-line no-var
  var loadPyodide: typeof LoadPyodide
}

interface Columns {
  id: number;
  name: string;
  description: string;
  code: string;
  last_modified_date: string;
  user_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class PyodideService {
  platform = inject(PLATFORM_ID);
  private httpClient = inject(HttpClient);

  constructor() {
    if (isPlatformBrowser(this.platform)) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
      script.onload = () => {
        this.pyodideScriptIsLoading = false;
      }
      document.head.appendChild(script);
    }
  }

  pyodideScriptIsLoading = true;
  private headerCode: undefined | string = undefined;
  async getHeaderCode() {
    if (typeof this.headerCode === 'string') return  this.headerCode;

    const url = `${environment.domain}/api/python/header_code`;

    const headerCode = await firstValueFrom(this.httpClient.get(url, { responseType: 'text' }));
    this.headerCode = headerCode;
    return headerCode
  }

  private exampleCode: string | undefined = undefined;
  async getExampleCode() {
    if (typeof this.exampleCode === 'string') return this.exampleCode;

    const url = `${environment.domain}/api/python/examples?quantity=1`;
    const json = await firstValueFrom(this.httpClient.get<{
      examples: string[];
    }>(url, { responseType: 'json' }));
    return json.examples[0];
  };

  async fetchExercisesByPage<T extends (keyof Columns)[]>(columns: T, query: string, page: number, pageSize: number) {
    const queryParams = new URLSearchParams();
    for (const column of new Set(columns)) queryParams.append('columns', column);
    queryParams.append('query', query);
    queryParams.append('page_number', String(page));
    queryParams.append('items_per_page', String(pageSize));

    const url = `${environment.domain}/api/python/exercises_by_filters?${queryParams.toString()}`;

    const json = await firstValueFrom(this.httpClient.get<{
      exercises: FilteredColumnsByArray<Columns, T>[];
      total: number;
    }>(url, { responseType: 'json' }));
  
    return json;
  }

  async fetchExercisesByIds<T extends (keyof Columns)[]>(columns: T, ids: number[]) {
    const queryParams = new URLSearchParams();
    for (const column of new Set(columns)) queryParams.append('columns', column);
    for (const id of ids) queryParams.append('ids', String(id));

    const url = `${environment.domain}/api/python/exercises_by_ids?${queryParams.toString()}`;

    const json = await firstValueFrom(this.httpClient.get<{
      exercises: FilteredColumnsByArray<Columns, T>[];
    }>(url, { responseType: 'json' }));

    return json;
  }

  async fetchExercise<T extends (keyof Columns)[]>(columns: T, id: number) {
    const json = await this.fetchExercisesByIds(columns, [id]);
    if (json.exercises.length === 0) return undefined;
  
    return json.exercises[0];
  }

  async createExercise(data: FilteredColumnsByArray<Columns, ['name', 'description', 'code']>) {
    const url = `${environment.domain}/api/python/exercise`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return await firstValueFrom(this.httpClient.post(url, data, { headers, responseType: 'text' }));
  }

  async updateExercise(id: number, data: FilteredColumnsByArray<Columns, ['name', 'description', 'code']>) {
    const url = `${environment.domain}/api/python/exercise/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return await firstValueFrom(this.httpClient.put(url, data, { headers, responseType: 'text' }));
  }

  pyodide: undefined | Awaited<ReturnType<typeof LoadPyodide>> = undefined;
  async getPyodide(_window=window) {
    if (this.pyodide !== undefined) return this.pyodide;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loadPyodide: typeof LoadPyodide = (window as any).loadPyodide;
    const pyodide = await loadPyodide();
    this.pyodide = pyodide;
    await this.pyodide.loadPackage('sympy');
    await this.pyodide.runPython('print("Loaded pyodide")');
    return this.pyodide;
  }

  async runPythonCode(code: string, _window=window): Promise<unknown> {
    const pyodide = await this.getPyodide();
    const result = await pyodide.runPython(code)
    if (typeof result === 'object' && result !== null) {
      return result.toJs({dict_converter : Object.fromEntries});
    }
    return result;
  };
}
