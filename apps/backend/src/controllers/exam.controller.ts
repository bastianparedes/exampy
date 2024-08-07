import { Controller, Inject, Post, Body, Req, Res } from '@nestjs/common';
import { AiService } from '../services/ai';
import { DbService } from '../services/db';
import { LatexService } from '../services/latex';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { IsInt, Max, Min, IsString, MaxLength, IsArray, ValidateNested, IsOptional, IsObject, IsNotEmptyObject, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { getShuffledArray } from '../utils/array';
import { writeFileSync } from 'fs';
import { Subject } from '../types/exercise';

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
  @ValidateNested({ each: true })
  @Type(() => ExerciseDescriptionValidator)
  uniqueSelection?: ExerciseDescriptionValidator[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDescriptionValidator)
  development?: ExerciseDescriptionValidator[];

  @IsOptional()
  @IsArray()
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

  @IsBoolean()
  includeAnswers: boolean;

  @IsString()
  @IsIn(['languageAndCommunication', 'mathematics', 'physics', 'chemistry', 'biology', 'naturalSciences', 'geographyAndSocialSciences', 'physicalEducation', 'visualArts', 'music', 'technology'])
  subject: Subject;
}

@Controller('exam')
export class ExamController {
  @Inject(DbService)
  dbService = new DbService();

  @Inject(AiService)
  aiService = new AiService();

  @Inject(LatexService)
  latexService = new LatexService();

  @Post()
  async PostCreateExam(@Body() body: BodyValidator, @Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const exercisesLatexCodes = await this.aiService.getExercisesLatexCodes(body.exercises, body.subject);

    const latexLinesQuestions: string[] = [];
    const latexLinesAnswers: string[] = ['\\newpage\\begin{center}\\LARGE Respuestas\\end{center}'];

    if (exercisesLatexCodes.uniqueSelection !== undefined) {
      const result = this.latexService.getLatexSectionUniqueSelection(getShuffledArray(exercisesLatexCodes.uniqueSelection));
      latexLinesQuestions.push(result.questions);
      latexLinesAnswers.push(result.answers);
    }

    if (exercisesLatexCodes.development !== undefined) {
      const result = this.latexService.getLatexSectionDevelopment(getShuffledArray(exercisesLatexCodes.development));
      latexLinesQuestions.push(result.questions);
      latexLinesAnswers.push(result.answers);
    }

    if (exercisesLatexCodes.trueOrFalse !== undefined) {
      const result = this.latexService.getLatexSectionTrueOrFalse(getShuffledArray(exercisesLatexCodes.trueOrFalse));
      latexLinesQuestions.push(result.questions);
      latexLinesAnswers.push(result.answers);
    }

    let completeLatexCodeLines = [...latexLinesQuestions];

    if (body.includeAnswers) completeLatexCodeLines = completeLatexCodeLines.concat(latexLinesAnswers);
    const completeLatexCode = this.latexService.getCompleteLatexCode(completeLatexCodeLines.join('\n'));

    if (process.env.NODE_ENV === 'development') writeFileSync('latex.tex', completeLatexCode, 'utf-8');

    const pdfUrl = new URL(await this.latexService.getPdfUrl(completeLatexCode));
    if (!pdfUrl.href.endsWith('.pdf')) return res.status(500).send(pdfUrl.href);

    const pathSections = pdfUrl.pathname.split('/');
    const lastPathSection = pathSections[pathSections.length - 1];

    res.send(lastPathSection);
    await this.dbService.db.insert(this.dbService.schema.Exams).values({
      name: lastPathSection,
      texCode: completeLatexCode
    });
  }
}
