import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { UserService } from 'src/user/user.service';
import { hash, verify } from 'argon2';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import type { ConfigType } from '@nestjs/config';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @Inject(refreshConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    ) { }

    async registerUser(createUserDto: CreateUserDto) {
        const userAlreadyMember = await this.userService.findByEmail(createUserDto.email);
        if (userAlreadyMember) {
            throw new ConflictException("Usuário já existe!");
        };

        return this.userService.create(createUserDto);
    };

    async validateLocalUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException("Usuário não encontrado.");
        };

        const isPasswordMatched = await verify(user.password, password);
        if (!isPasswordMatched) {
            throw new UnauthorizedException("Credenciais inválidas.");
        };

        return { id: user.id, name: user.name, role: user.role };
    };

    async login(userId: number, name: string, role: Role) {
        const { accessToken, refreshToken } = await this.generateTokens(userId);

        const hashedRefreshToken = await hash(refreshToken);
        await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

        return {
            id: userId,
            name: name,
            role: role,
            accessToken,
            refreshToken,
        };
    };

    async generateTokens(userId: number) {
        const payload: AuthJwtPayload = { sub: userId };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfig),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    };

    async validateJwtUser(userId: number) {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new UnauthorizedException("Usuário não encontrado.");
        };

        const currentUser = { id: (await user)?.id, role: user.role };
        return currentUser;
    };

    async validateRefreshToken(userId: number, refreshToken: string) {
        const user = await this.userService.findOne(userId);
        if (!user)
            throw new UnauthorizedException("Usuário não encontrado.");
        if (user.hashedRefreshToken === null)
            throw new UnauthorizedException("Erro no token.");

        const refreshTokenMatched = await verify(user.hashedRefreshToken, refreshToken);
        if (!refreshTokenMatched)
            throw new UnauthorizedException("Token de refresh inválido.");

        const currentUser = { id: (await user)?.id, name: (await user).name };
        return currentUser;
    };

    async refreshToken(userId: number, name: string) {
        const { accessToken, refreshToken } = await this.generateTokens(userId);

        const hashedRefreshToken = await hash(refreshToken);
        await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

        return {
            id: userId,
            name: name,
            accessToken,
            refreshToken,
        };
    };

    async signOut(userId: number) {
        return await this.userService.updateHashedRefreshToken(userId, null);
    };
};