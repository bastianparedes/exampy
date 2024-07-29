import { Injectable } from '@nestjs/common';
import * as schema from './schema';
import db from './client';

@Injectable()
export class DbService {
  readonly db = db;
  readonly schema = schema;
}
