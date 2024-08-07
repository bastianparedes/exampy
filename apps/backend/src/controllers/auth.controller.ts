import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db';
import { IsString, IsEmail, IsNotEmpty, IsDate } from 'class-validator';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

class BodyValidatorSignup {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsDate()
  dateOfBirth: Date;
}

class BodyValidatorLogin {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

@Controller('auth')
export class AuthController {
  @Inject(JwtService)
  jwtService = new JwtService();

  @Inject(AuthService)
  authService = new AuthService();

  @Inject(DbService)
  dbService = new DbService();

  JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

  @Post('sign_up')
  async postSignup(@Body() body: BodyValidatorSignup, @Res() res: FastifyReply) {
    await this.dbService.db.insert(this.dbService.schema.users).values({
      email: body.email,
      passwordHash: await bcrypt.hash(body.password, await bcrypt.genSalt(10)),
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth.toString()
    });
    res.status(204).send();
  }

  @Post('login')
  async postLogin(@Body() body: BodyValidatorLogin, @Res() res: FastifyReply) {
    const [userData] = await this.dbService.db.select().from(this.dbService.schema.users).where(this.dbService.operators.eq(this.dbService.schema.users.email, body.email)).limit(1);

    const userExists = userData !== undefined;
    if (!userExists) throw new UnauthorizedException('Invalid email or password');

    const passwordIsCorrect = await bcrypt.compare(body.password, userData.passwordHash);
    if (!passwordIsCorrect) throw new UnauthorizedException('Invalid email or password');

    res.setCookie(this.authService.cookieName, await this.jwtService.signAsync({ id: userData.id, name: userData.firstName }), {
      httpOnly: true,
      secure: true,
      maxAge: 3600,
      path: '/' // 1h
    });
    res.status(204).send();
  }

  @Get('logout')
  async getLogout(@Res() res: FastifyReply) {
    res.clearCookie(this.authService.cookieName);
    res.status(204).send();
  }
}
