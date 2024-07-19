import { Injectable, inject } from '@angular/core';
import { PyodideService } from './pyodide.service';
import { LatexService } from './latex.service';
import Ajv from 'ajv';
import { everyElementIsDifferent, arraysAreEqual, shuffleArray, reorderArrayByIndexes, createArrayUpToNumber } from '../utils/array';


interface Exercise {
  alternatives_texts: string[];
  alternatives_identifiers: ((number | string | boolean | null | undefined)[])[];
  question_identifiers: (number | string | boolean | null | undefined)[];
  question: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  pyodide = inject(PyodideService);
  latex = inject(LatexService);

  async validateResult(resultFromCode: unknown): Promise<{ isValid: true; instance: Exercise; } | { isValid: false; message: string; }> {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile({
        type: 'object',
        properties: {
          alternatives_texts: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        required: ['alternatives_texts']
      })
      const valid = validate(resultFromCode)
      if (!valid) return {
        isValid: false as const,
        message: 'Must have "alternatives_texts"'
      };
    }

    // eslint-disable-next-line no-constant-condition
    if (true) {
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile({
        type: 'object',
        properties: {
          alternatives_identifiers: {
            type: 'array',
            items: {
              type: 'array',
              items: {
                oneOf: [
                  { type: 'number' },
                  { type: 'boolean' },
                  { type: 'string' },
                  { type: 'null' },
                  { type: "null", const: undefined }
                ]
              }
            }
          },
        },
        required: ['alternatives_identifiers']
      })
      const valid = validate(resultFromCode)
      if (!valid) return {
        isValid: false as const,
        message: 'Must have "alternatives_identifiers"'
      };
    }

    // eslint-disable-next-line no-constant-condition
    if (true) {
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile({
        type: 'object',
        properties: {
          question_identifiers: {
            type: 'array',
            items: {
              oneOf: [
                { type: 'number' },
                { type: 'string' },
                { type: 'boolean' },
                { type: 'null' },
                { type: "null", const: undefined }
              ]
            }
          },
        },
        required: ['question_identifiers']
      })
      const valid = validate(resultFromCode)
      if (!valid) return {
        isValid: false as const,
        message: 'Must have "question_identifiers"'
      };
    }

    // eslint-disable-next-line no-constant-condition
    if (true) {
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile({
        type: 'object',
        properties: {
          question: {
            type: 'string',
          }
        },
        required: ['question']
      })
      const valid = validate(resultFromCode)
      if (!valid) return {
        isValid: false as const,
        message: 'Must have "question"'
      };
    }

    return {
      isValid: true,
      instance: resultFromCode as Exercise
    }
  };

  async createExercise(
    fnCode: string,
    maxTriesToCreateValidExercise: number,
    _window=window
  ) {
    let message = '';
    for (let numberTry = 1 ; numberTry <= maxTriesToCreateValidExercise ; numberTry++) {
      try {
        const resultFn = await this.pyodide.runPythonCode('next(GENERATOR)', _window);
        const resultTringCreateExercise = await this.validateResult(resultFn);
        if (resultTringCreateExercise.isValid) {
          return resultTringCreateExercise;
        }
        message = resultTringCreateExercise.message;
      } catch (error) {
        return {
          isValid: false as const,
          message: String(error)
        }
      }
    }

    return {
      isValid: false as const,
      message: message
    }
  }

  async createMultipleExercisesFromOneCode(
    fnCode: string,
    quantity: number,
    maxTriesToCreateValidExercise: number,
    maxTriesToCreateExerciseDifferent: number,
    _window=window
  ) {
    const exercises: Exercise[] = [];
    await this.pyodide.runPythonCode([await this.pyodide.getHeaderCode(), fnCode, 'GENERATOR = fn()'].join('\n'), _window);
    for (let numberExercise = 1 ; numberExercise <= quantity ; numberExercise++) {
      for (let numberTryExerciseDifferent = 1 ; numberTryExerciseDifferent <= maxTriesToCreateExerciseDifferent ; numberTryExerciseDifferent++) {
        const newExerciseData = await this.createExercise(
          fnCode,
          maxTriesToCreateValidExercise,
          _window
        );
        if (!newExerciseData.isValid) return newExerciseData;

        if (newExerciseData.instance.alternatives_texts.length !== newExerciseData.instance.alternatives_identifiers.length) continue;

        const newExerciseHasRepeatedAlternatives = !everyElementIsDifferent(newExerciseData.instance.alternatives_identifiers);
        if (newExerciseHasRepeatedAlternatives) continue;

        const newExerciseIsAlreadyUsed = exercises.some((exercise) => arraysAreEqual(exercise.question_identifiers, newExerciseData.instance.question_identifiers));
        if (newExerciseIsAlreadyUsed) continue;

        exercises.push(newExerciseData.instance);
        break;
      }
    }

    if (exercises.length !== quantity) return {
      isValid: false as const,
      message: `Could not create ${quantity} different exercises in ${maxTriesToCreateExerciseDifferent} tries`
    }

    return {
      isValid: true as const,
      exercises
    };
  }

  async createMultipleExercisesFromMultipleCodes(
    exerciseRequestedDatas: {fnCode: string, quantity: number}[],
    maxTriesToCreateValidExercise: number,
    maxTriesToCreateExerciseDifferent: number,
    _window=window
  ) {
    const exercises: Exercise[] = [];

    for (const exerciseRequestedData of exerciseRequestedDatas) {
      const exercisesFromOneCode = await this.createMultipleExercisesFromOneCode(
        exerciseRequestedData.fnCode,
        exerciseRequestedData.quantity,
        maxTriesToCreateValidExercise,
        maxTriesToCreateExerciseDifferent,
        _window
      );
      if (!exercisesFromOneCode.isValid) return exercisesFromOneCode;

      exercises.push(...exercisesFromOneCode.exercises);
    }

    return {
      isValid: true as const,
      exercises
    };
  }

  async createExam(
    exerciseRequestedDatas: {fnCode: string, quantity: number}[],
    includeAnswers=true,
    maxTriesToCreateValidExercise: number,
    maxTriesToCreateExerciseDifferent: number,
    _window=window
  ) {
    const exercises = await this.createMultipleExercisesFromMultipleCodes(
      exerciseRequestedDatas,
      maxTriesToCreateValidExercise,
      maxTriesToCreateExerciseDifferent,
      _window
    );
    if (!exercises.isValid) return exercises;

    const correctAlternatives: string[] = [];

    // desordena las alternativas
    exercises.exercises.forEach((exercise) => {
      const indexes = shuffleArray(createArrayUpToNumber(exercise.alternatives_texts.length - 1));
      exercise.alternatives_texts = reorderArrayByIndexes(exercise.alternatives_texts, indexes);

      const indexCorrectAnswer = indexes.indexOf(0);

      correctAlternatives.push(String.fromCharCode(65 + indexCorrectAnswer));
      return exercise;
    });

    const latexCodeFromExercisesUniqueSelection = exercises.exercises.map((exercise) => ({
      question: exercise.question,
      alternatives_texts: exercise.alternatives_texts
    }));

    
    

    const latexCodes: string[] = [];

    const latexExercises = this.latex.tableUniqueSelection(latexCodeFromExercisesUniqueSelection);
    latexCodes.push(latexExercises);
    if (includeAnswers) {
      latexCodes.push('\\newpage%');
      latexCodes.push('\\begin{center} \\Huge Answers \\end{center}%')
      
      const latexAnswers = this.latex.answersUniqueSelection(correctAlternatives)
      latexCodes.push(latexAnswers);
    }

    const completeLatexCode = this.latex.completeLatexCode(latexCodes.join('\n'));
    const latexExam = await this.latex.getPdfUrl(completeLatexCode);

    if (latexExam.endsWith('.pdf')) return {
      isValid: true as const,
      url: latexExam
    }

    return {
      isValid: false as const,
      message: 'Latex code cannot create PDF file'
    }
  }
}
