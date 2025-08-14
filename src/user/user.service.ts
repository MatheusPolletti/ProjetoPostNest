import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    return await this.prisma.user.create({
      data: {
        password: hashedPassword,
        ...user
      }
    });
  };

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      }
    });
  };

  async findOne(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    });
  };

  async updateHashedRefreshToken(userId: number, hashedRefreshToken: string | null) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hashedRefreshToken,
      },
    });
  };
};