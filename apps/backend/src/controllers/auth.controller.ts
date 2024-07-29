import { Controller, Inject, Get, Req, Res } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import env from '../env';
import { DbService } from '../services/db';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  authService = new AuthService();

  @Inject(DbService)
  dbService = new DbService();

  @Get('login')
  login(@Res() res: FastifyReply) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('client_id', env.CLIENT_ID);
    urlSearchParams.append('response_type', 'code');
    const fullUrl = `https://github.com/login/oauth/authorize?${urlSearchParams.toString()}`;
    return res.status(302).redirect(fullUrl);
  }

  @Get('post_login')
  async postLogin(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const code = req.query['code'] as string | undefined;
    if (code === undefined) return res.redirect('/');

    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('client_id', env.CLIENT_ID);
    urlSearchParams.append('client_secret', env.CLIENT_SECRET);
    urlSearchParams.append('code', code);

    const response = await fetch(
      `https://github.com/login/oauth/access_token?${urlSearchParams.toString()}`,
      {
        method: 'POST',
        headers: { Accept: 'application/json' },
      },
    );
    const json = await response.json();
    const accessToken = json['access_token'];
    const githubUserData =
      await this.authService.getGithubUserData(accessToken);
    if (githubUserData !== null) {
      const { id, name, email } = githubUserData;
      await this.dbService.db
        .insert(this.dbService.schema.Users)
        .values({ id, name, email })
        .onConflictDoUpdate({
          target: this.dbService.schema.Users.id,
          set: { name, email },
        });
    }
    res.setCookie('access_token', accessToken, {
      secure: true,
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });
    return res.status(302).redirect('/');
  }

  @Get('user_data')
  async userData(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const accessToken = req.cookies['access_token'] as string | undefined;
    if (accessToken === undefined) return res.send(null);
    const data = await this.authService.getGithubUserData(accessToken);
    return res.send(data);
  }

  @Get('logout')
  async logout(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const accessToken = req.cookies['access_token'];
    res.clearCookie('access_token', { secure: true });

    if (!accessToken) {
      return res.redirect('/');
    }

    await fetch(`https://api.github.com/applications/${env.CLIENT_ID}/token`, {
      method: 'DELETE',
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    });

    res.clearCookie('access_token', { secure: true });
    return res.status(302).redirect('/');
    // comentario a borrar
    // return res.status(302).redirect('https://github.com/logout');
  }
}
