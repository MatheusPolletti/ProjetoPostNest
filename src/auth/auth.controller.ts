import { Body, Controller, Post, Request, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Public()
  @Post("signup")
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  };

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req) {
    console.log('re', req.user.id, req.user.name, req.role)
    return this.authService.login(req.user.id, req.user.name, req.user.role);
  };

  @Roles('ADMIN', 'EDITOR')
  // Aqui se fizesse assim seria ao contrário
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  @Get("protected")
  getAll(@Request() req) {
    return { message: `pode acessar essa api protegida ${req.user.id}` };
  };

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  };

  @Post("signout")
  signOut(@Req() req) {
    return this.authService.signOut(req.user.id);
  };
};