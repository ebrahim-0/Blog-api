import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as {
      message: any;
      error: string;
      statusCode: number;
    };

    const formattedErrors = this.formatErrors(exceptionResponse.message);
    response.status(status).json({
      errors: formattedErrors,
      error: 'Bad Request',
      statusCode: status,
    });
  }

  private formatErrors(messages: any): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    if (Array.isArray(messages)) {
      messages.forEach((message) => {
        const match = message.match(
          /^(.*?)(?:\s*(?:must be|should be|is|required)\s*(.*))$/,
        );
        if (match) {
          const field = match[1].trim().toLowerCase();
          const errorType = match[2]?.trim();
          const errorMessage = message;

          if (!errors[field]) {
            errors[field] = [];
          }

          if (errorType === 'required') {
            errors[field].unshift(errorMessage);
          } else {
            errors[field].push(errorMessage);
          }
        } else {
          errors['general'] = errors['general'] || [];
          errors['general'].push(message);
        }
      });
    }

    return errors;
  }
}
