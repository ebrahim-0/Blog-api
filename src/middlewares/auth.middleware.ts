import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.headers['x-refresh-token'] as string;

    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      req['user'] = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError' && refreshToken) {
        try {
          const decodedRefreshToken = this.jwtService.verify(
            refreshToken,
            {
              secret: process.env.JWT_REFRESH_SECRET,
            },
          );

          const accessToken = this.jwtService.sign(decodedRefreshToken, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1m',
          });
          res.setHeader('x-access-token', accessToken);
          req['user'] = decodedRefreshToken
          next();
        } catch (refreshErr) {
          throw new UnauthorizedException(
            'Refresh token is invalid or expired',
          );
        }
      } else {
        throw new UnauthorizedException('Invalid token or expired');
      }
    }
  }
}
