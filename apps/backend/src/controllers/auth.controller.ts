import { Body, Controller, Get, Inject, Post, Req, Res, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db';
import { IsString, IsEmail, MaxLength, MinLength, IsBoolean, IsArray, ArrayNotEmpty, IsIn, IsNotIn } from 'class-validator';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Transform } from 'class-transformer';

class BodyValidatorSignup {
  @IsEmail()
  email: string;

  @MaxLength(255)
  @MinLength(6)
  @IsString()
  password: string;

  @MaxLength(255)
  @IsString()
  firstName: string;

  @MaxLength(255)
  @IsString()
  lastName: string;
}

class BodyValidatorLogin {
  @MaxLength(255)
  @IsString()
  email: string;

  @MaxLength(255)
  @IsString()
  password: string;

  @IsBoolean()
  keepSesion: boolean;
}

class QueryValidatorUserData {
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), { toClassOnly: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsIn(['firstName', 'lastName', 'email', 'createdAt'], { each: true })
  @IsNotIn(['passwordHash'], { each: true })
  columns: string[];
}

@Controller('auth')
export class AuthController {
  @Inject(JwtService)
  jwtService = new JwtService();

  @Inject(AuthService)
  authService = new AuthService();

  @Inject(DbService)
  dbService = new DbService();

  private readonly cookieTokenName = 'access_token';

  @Post('sign_up')
  async postSignup(@Body() body: BodyValidatorSignup, @Res() res: FastifyReply) {
    await this.dbService.db.insert(this.dbService.schema.Users).values({
      email: body.email,
      passwordHash: await bcrypt.hash(body.password, await bcrypt.genSalt(10)),
      firstName: body.firstName,
      lastName: body.lastName
    });
    res.status(201).send();
  }

  @Post('log_in')
  async postLogin(@Body() body: BodyValidatorLogin, @Res() res: FastifyReply) {
    const [userData] = await this.dbService.db.select().from(this.dbService.schema.Users).where(this.dbService.operators.eq(this.dbService.schema.Users.email, body.email)).limit(1);

    const userExists = userData !== undefined;
    if (!userExists) throw new UnauthorizedException('Invalid email or password');

    const passwordIsCorrect = await bcrypt.compare(body.password, userData.passwordHash);
    if (!passwordIsCorrect) throw new UnauthorizedException('Invalid email or password');

    res
      .setCookie(this.cookieTokenName, await this.jwtService.signAsync({ id: userData.id }), {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: body.keepSesion ? 60 * 60 * 24 : undefined, // 1h
        path: '/'
      })
      .status(204)
      .send();
  }

  @Get('log_out')
  async getLogout(@Res() res: FastifyReply) {
    res.clearCookie(this.cookieTokenName);
    res.status(204).send();
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('user_data')
  async getUserData(@Query() query: QueryValidatorUserData, @Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const columnNames = query.columns as typeof this.dbService.columns.Users;

    const token = req.cookies[this.cookieTokenName];
    const dataFromToken = this.jwtService.decode(token) as { id: number; iat: number; exp: number } | null;
    if (dataFromToken === null) return res.send({ authorized: false });

    const columnobject = columnNames.reduce(
      (object, columnName) => {
        object[columnName] = true;
        return object;
      },
      {} as { [key in (typeof columnNames)[number]]: boolean }
    );

    const userData = await this.dbService.db.query.Users.findFirst({
      columns: columnobject,
      where: this.dbService.operators.eq(this.dbService.schema.Users.id, dataFromToken.id)
    });

    if (userData === undefined) return res.status(404).send({});
    res.send(userData);
  }
}
