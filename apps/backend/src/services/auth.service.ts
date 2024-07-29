import { Injectable } from '@nestjs/common';
import type { GithubUserData } from '../types/github';

@Injectable()
export class AuthService {
  async getGithubUserData(accessToken: string): Promise<null | GithubUserData> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) return null;
    return (await response.json()) as GithubUserData;
  }
}
