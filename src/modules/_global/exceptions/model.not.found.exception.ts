import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelNotFoundResponse } from '@modules/_global/responses/model.not.found.response';

@Injectable()
export class ModelNotFoundException extends HttpException {
  constructor(model: string, id: string) {
    super(
      ModelNotFoundResponse.fromModelNotFound(model, id), // Genera una respuesta estructurada para "modelo no encontrado"
      HttpStatus.NOT_FOUND, // Establece el código HTTP 404
    );
  }
}
