import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

// Declarar que é um provider
@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) { }

  private async _validatePostExistenceAndOwner(postId: number, userId: number) {
    const postExist = await this.prisma.posts.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExist) {
      throw new HttpException("Post não encontrado", HttpStatus.NOT_FOUND);
    };
    if (postExist.authorId !== userId) {
      throw new HttpException("Você não pode mudar esse post", HttpStatus.FORBIDDEN);
    };

    return postExist;
  };

  async newPost(userId: number, title: string, content: string) {
    const isPostCreated = await this.prisma.posts.create({
      data: {
        authorId: userId,
        title: title,
        content: content,
      },
      select: {
        id: true,
        title: true,
        content: true,
        autor: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    if (!isPostCreated) {
      throw new BadRequestException("Erro inesperado ao criar o post.");
    };

    return isPostCreated;
  };

  async getPosts() {
    const posts = await this.prisma.posts.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        autor: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    posts.forEach(post => {
      if (post.content.length > 30) {
        post.content = post.content.substring(0, 30) + '...';
      };
    });

    return posts;
  };

  async getPost(postId: number) {
    const post = await this.prisma.posts.findUnique({
      select: {
        id: true,
        title: true,
        content: true,
        autor: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new HttpException("Post não encontrado", HttpStatus.NOT_FOUND);
    };

    return post;
  };

  async getUserPosts(userId: number) {
    const userPosts = await this.prisma.posts.findMany({
      where: {
        authorId: userId
      },
    });

    return userPosts;
  };

  async updatePost(userId: number, postId: number, title: string, content: string) {
    await this._validatePostExistenceAndOwner(postId, userId);

    const updatedPost = await this.prisma.posts.update({
      data: {
        title: title,
        content: content,
      },
      where: {
        id: postId,
        authorId: userId,
      },
    });

    if (!updatedPost) {
      throw new BadRequestException("Erro inesperado ao atualizar seu post.");
    };

    return updatedPost;
  };

  async deletePost(userId: number, postId: number) {
    await this._validatePostExistenceAndOwner(postId, userId);

    const deletedPost = await this.prisma.posts.delete({
      where: {
        id: postId
      },
    });

    return deletedPost;
  };
};