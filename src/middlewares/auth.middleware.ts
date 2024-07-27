import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { generateToken } from 'src/utils/generateToken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.headers['x-refresh-token'] as string;

    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req['user'] = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError' && refreshToken) {
        try {
          const decodedRefreshToken = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET,
          );
          const token = generateToken(decodedRefreshToken, '1d');
          res.setHeader('x-access-token', token);
          req['user'] = jwt.verify(token, process.env.JWT_SECRET);
          next();
        } catch (refreshErr) {
          throw new UnauthorizedException(
            'Refresh token is invalid or expired',
          );
        }
      } else {
        throw new BadRequestException('Invalid token');
      }
    }
  }
}
