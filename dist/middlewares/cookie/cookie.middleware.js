"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let CookieMiddleware = class CookieMiddleware {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    use(req, res, next) {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        const refreshToken = req.headers['x-refresh-token'];
        try {
            const decoded = this.jwtService.verify(accessToken, {
                secret: process.env.JWT_SECRET,
            });
            req['user'] = decoded;
            return next();
        }
        catch (err) {
            if ((err.name === 'TokenExpiredError' ||
                err.name === 'JsonWebTokenError') &&
                refreshToken) {
                try {
                    const decodedRefreshToken = this.jwtService.verify(refreshToken, {
                        secret: process.env.JWT_REFRESH_SECRET,
                    });
                    const accessToken = this.jwtService.sign(decodedRefreshToken, {
                        secret: process.env.JWT_SECRET,
                    });
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: false,
                        secure: process.env.NODE_ENV !== 'development',
                        maxAge: 1000 * 60 * 60 * 24 * 7,
                        sameSite: 'none',
                        path: '/',
                    });
                    res.cookie('accessToken', accessToken, {
                        httpOnly: false,
                        secure: process.env.NODE_ENV !== 'development',
                        sameSite: 'none',
                        maxAge: 1000 * 60 * 60 * 24 * 7,
                        path: '/',
                    });
                    req['user'] = decodedRefreshToken;
                    next();
                }
                catch (refreshErr) {
                    throw new common_1.UnauthorizedException('Refresh token is invalid or expired cookie');
                }
            }
            else {
                throw new common_1.UnauthorizedException('Invalid token or expired cookie');
            }
        }
        next();
    }
};
exports.CookieMiddleware = CookieMiddleware;
exports.CookieMiddleware = CookieMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], CookieMiddleware);
//# sourceMappingURL=cookie.middleware.js.map