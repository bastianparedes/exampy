import { Controller, Inject, Post, Body, Req, Res, Get } from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { DbService } from '../services/db';
import { LatexService } from '../services/latex.service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  IsInt,
  Max,
  Min,
  IsString,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
  IsObject,
  IsNotEmptyObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { getShuffledArray } from '../utils/array';
import { writeFileSync } from 'fs';
class ExerciseDescriptionValidator {
  @IsString()
  @MaxLength(200)
  description: string;

  @IsInt()
  @Min(1)
  @Max(10)
  quantity: number;
}

class ExercisesValidator {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDescriptionValidator)
  uniqueSelection?: ExerciseDescriptionValidator[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDescriptionValidator)
  development?: ExerciseDescriptionValidator[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDescriptionValidator)
  trueOrFalse?: ExerciseDescriptionValidator[];
}

class BodyValidator {
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ExercisesValidator)
  exercises: ExercisesValidator;
}

@Controller('exam')
export class ExamController {
  @Inject(DbService)
  dbService = new DbService();

  @Inject(AiService)
  aiService = new AiService();

  @Inject(LatexService)
  latexService = new LatexService();

  @Get()
  async getHealth() {
    return 'ok';
  }

  @Post()
  async PostCreateExam(
    @Body() body: BodyValidator,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    const exercisesLatexCodes = await this.aiService.getExercisesLatexCodes(
      body.exercises,
    );

    const latexLinesQuestions: string[] = [];
    const latexLinesAnswers: string[] = [
      '\\newpage\\begin{center}\\LARGE Respuestas\\end{center}',
    ];

    if (exercisesLatexCodes.uniqueSelection !== undefined) {
      const result = this.latexService.getLatexSectionUniqueSelection(
        getShuffledArray(exercisesLatexCodes.uniqueSelection),
      );
      latexLinesQuestions.push(result.questions);
      latexLinesAnswers.push(result.answers);
    }

    if (exercisesLatexCodes.development !== undefined) {
      const result = this.latexService.getLatexSectionDevelopment(
        getShuffledArray(exercisesLatexCodes.development),
      );
      latexLinesQuestions.push(result.questions);
      latexLinesAnswers.push(result.answers);
    }

    if (exercisesLatexCodes.trueOrFalse !== undefined) {
      const result = this.latexService.getLatexSectionTrueOrFalse(
        getShuffledArray(exercisesLatexCodes.trueOrFalse),
      );
      latexLinesQuestions.push(result.questions);
      latexLinesAnswers.push(result.answers);
    }

    const completeLatexCode = this.latexService.getCompleteLatexCode(
      [...latexLinesQuestions, ...latexLinesAnswers].join('\n'),
    );

    if (process.env.NODE_ENV === 'development')
      writeFileSync('latex.tex', completeLatexCode, 'utf-8');

    const pdfUrl = new URL(
      await this.latexService.getPdfUrl(completeLatexCode),
    );
    if (!pdfUrl.href.endsWith('.pdf')) return res.status(500).send(pdfUrl.href);

    const pathSections = pdfUrl.pathname.split('/');
    const lastPathSection = pathSections[pathSections.length - 1];

    res.send(lastPathSection);
    await this.dbService.db.insert(this.dbService.schema.Exams).values({
      name: lastPathSection,
    });
  }
}
