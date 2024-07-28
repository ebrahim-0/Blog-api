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
      console.log(err);
      console.log(err.name);
      console.log('refreshToken', refreshToken);
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
          res.setHeader('Authorization', `Bearer ${accessToken}`);

          res.cookie('refreshToken', refreshToken, {
            httpOnly: false,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            sameSite: 'none',
            domain: '.vercel.app',
            // domain: 'http://localhost:5173',
          });
          res.cookie('accessToken', accessToken, {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            domain: '.vercel.app',
            // domain: 'http://localhost:5173',
          });
          console.log('Refresh token is valid');
          req['user'] = decodedRefreshToken;
          next();
        } catch (refreshErr) {
          console.log(refreshErr);
          console.log('Refresh token is invalid or expired log');
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
