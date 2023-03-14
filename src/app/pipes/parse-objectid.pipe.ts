// Parse Mongodb Object Id Pipe for Nest js
import {
  ArgumentMetadata,
  HttpException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (isValidObjectId(value)) {
      return value;
    } else {
      throw new HttpException(
        `Invalid Object Id in ${metadata.type} object`,
        400,
      );
    }
  }
}
