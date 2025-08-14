import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            usernameField: "email",
            passwordField: "password",
        });
    };

    // request.user
    validate(email: string, password: string, role: Role) {
        return this.authService.validateLocalUser(email, password);
    };
};