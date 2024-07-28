import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CookieMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.headers['x-refresh-token'] as string;

    try {
      const decoded = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      req['user'] = decoded;
      return next();
    } catch (err) {
      if (
        (err.name === 'TokenExpiredError' ||
          err.name === 'JsonWebTokenError') &&
        refreshToken
      ) {
        try {
          const decodedRefreshToken = this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET,
          });

          const accessToken = this.jwtService.sign(decodedRefreshToken, {
            secret: process.env.JWT_SECRET,
          });
          // res.setHeader('Authorization', `Bearer ${accessToken}`);

          res.cookie('refreshToken', refreshToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV !== 'development', // Set to true only in production
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            sameSite: 'none',
            path: '/',
          });
          res.cookie('accessToken', accessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV !== 'development', // Set to true only in production
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            path: '/',
          });
          req['user'] = decodedRefreshToken;
          next();
        } catch (refreshErr) {
          throw new UnauthorizedException(
            'Refresh token is invalid or expired cookie',
          );
        }
      } else {
        throw new UnauthorizedException('Invalid token or expired cookie');
      }
    }
    next();
  }
}
