import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelNotFoundResponse } from '@modules/_global/responses/model.not.found.response';

@Injectable()
export class ModelNotFoundException extends HttpException {
  constructor(model: string, id: string) {
    super(
      ModelNotFoundResponse.fromModelNotFound(model, id),
      HttpStatus.NOT_FOUND,
    );
  }
}
