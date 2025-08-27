import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [
    PostsController
  ],
  providers: [
    PostsService,
    PrismaService,
    JwtAuthGuard,
    // Protegendo todo o controller com o Auth Guard de login
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})

export class PostsModule { }