"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let ValidationExceptionFilter = class ValidationExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        const formattedErrors = this.formatErrors(exceptionResponse.message);
        response.status(status).json({
            errors: formattedErrors,
            error: 'Bad Request',
            statusCode: status,
        });
    }
    formatErrors(messages) {
        const errors = {};
        if (Array.isArray(messages)) {
            messages.forEach((message) => {
                const match = message.match(/^(.*?)(?:\s*(?:must be|should be|is|required)\s*(.*))$/);
                if (match) {
                    const field = match[1].trim().toLowerCase();
                    const errorType = match[2]?.trim();
                    const errorMessage = message;
                    if (!errors[field]) {
                        errors[field] = [];
                    }
                    if (errorType === 'required') {
                        errors[field].unshift(errorMessage);
                    }
                    else {
                        errors[field].push(errorMessage);
                    }
                }
                else {
                    errors['general'] = errors['general'] || [];
                    errors['general'].push(message);
                }
            });
        }
        return errors;
    }
};
exports.ValidationExceptionFilter = ValidationExceptionFilter;
exports.ValidationExceptionFilter = ValidationExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.BadRequestException)
], ValidationExceptionFilter);
//# sourceMappingURL=validation.exception.js.map