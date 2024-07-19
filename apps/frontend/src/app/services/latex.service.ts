import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LatexService {
  private httpClient = inject(HttpClient);
  private platform = inject(PLATFORM_ID);

  pdfUrl: undefined | string = undefined;
  packages = `
\\documentclass{article}%
\\usepackage[T1]{fontenc}%
\\usepackage[utf8]{inputenc}%
\\usepackage{lmodern}%
\\usepackage{textcomp}%
\\usepackage{lastpage}%
\\usepackage{ragged2e}%
\\usepackage{setspace}%
\\usepackage{longtable}%
\\usepackage{tabularx}%
\\usepackage{gensymb}%
\\usepackage{amsmath}%
\\usepackage{amssymb}%
\\usepackage{enumitem}%
\\usepackage{graphicx}%
\\usepackage{tikz}%
\\usepackage{tkz-euclide}%
\\usepackage{siunitx}%
\\usepackage{fourier}%
\\usepackage{fancyhdr}%
%\\usepackage[papersize={21.59cm, 27.94cm}, tmargin=2.0cm, bmargin=2.0cm, lmargin=2.0cm, rmargin=2.0cm]{geometry}%
\\usepackage[a4paper, margin=1cm, bmargin=2cm]{geometry}%
\\usetikzlibrary{fit, shapes.geometric, quotes, angles, through, intersections}%
`.trim();

  studentDataTable = `
\\begin{longtable}{|p{0.475\\linewidth}|p{0.475\\linewidth}|}%
  \\hline%
  Establecimiento:&Profesor(a):%
  \\\\%
  \\hline%
  Asignatura:&Curso:%
  \\\\%
  \\hline%
\\end{longtable}%
`.trim();

  tableUniqueSelection(exercises: {
    question: string;
    alternatives_texts: string[];
  }[]
  ) {
    const latexLines = [
      '\\textbf{Item selección múltiple:} Encierra la alternativa correcta de cada ejercicio.%',
      '\\begin{longtable}{|p{0.475\\linewidth}|p{0.475\\linewidth}|}%',
      '\\hline%',
    ];

    exercises.forEach((exercise, indexExercise) => {
      latexLines.push('\\begin{minipage}[t]{\\linewidth}%');
      latexLines.push('\\vspace{5pt}%');
      latexLines.push(
        `\\begin{enumerate}[label=\\arabic*),start=${indexExercise + 1}]%`
      );
      latexLines.push('\\item%');
      latexLines.push(exercise.question + '%');
      latexLines.push('\\end{enumerate}%');
      latexLines.push('\\begin{enumerate}[label=\\Alph*)]%');
      exercise.alternatives_texts.forEach((alternative) => {
        latexLines.push('\\item%');
        latexLines.push(alternative + '%');
        latexLines.push('\\hfill \\break%');
      });
      latexLines.push('\\end{enumerate}%');
      latexLines.push('\\end{minipage}%');

      const isLastExercise = indexExercise + 1 === exercises.length;

      if (indexExercise % 2 === 0) {
        latexLines.push('&%');
      }
      if (indexExercise % 2 === 1 || isLastExercise) {
        latexLines.push('\\\\%');
        latexLines.push(`\\hline%`);
      }
    });

    latexLines.push('\\end{longtable}%');
    return latexLines.join('\n');
  }

  answersUniqueSelection(alternatives_texts: string[]) {
    return [
      '\\begin{enumerate}[label=\\arabic*)]%',
      ...alternatives_texts.map((alternative_text) => `\\item ${alternative_text}%`),
      '\\end{enumerate}%',
    ].join('\n');
  }

  completeLatexCode(body: string) {
    return [
      this.packages,
      '\\begin{document}%',
      this.studentDataTable,
      body,
      '\\end{document}%',
    ].join('\n');
  };

  async getPdfUrl(latexCode: string) {
    const url = `${environment.domain}/api/python/pdf_url`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = {
      latex_code: latexCode,
    };
    const urlPdf = await firstValueFrom(this.httpClient.post(url, body, { headers, responseType: 'text' }));
    return urlPdf
  }
}
