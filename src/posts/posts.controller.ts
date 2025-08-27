import { Controller, Get, Post, Body, Patch, Delete, Req, Query, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { newPostDto } from './dto/new.post.dto';
import { updatePostDto } from './dto/update.post.dto';
import { deletePostDto } from './dto/delete.post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  // Isso é o que faz ser público, com acesso a todos, sem isso, precisa estar logado e mandar o token;
  // @Public() 
  // JwtAuthGuard para pegar o id do usuário
  // Também podemos fazer isso pelo module, como estamos fazendo
  // @UseGuards(JwtAuthGuard)
  @Post("new")
  async newPost(@Req() req, @Body() createPostDto: newPostDto) {
    const createdPost = this.postsService.newPost(req.user.id, createPostDto.title, createPostDto.content);

    return createdPost;
  };

  @Get("posts")
  async getPosts() {
    const posts = this.postsService.getPosts();

    return posts;
  };

  @Get(":postId")
  async getPost(@Param('postId', ParseIntPipe) postId: number) {
    const post = this.postsService.getPost(postId);

    return post;
  };

  @Get("user-posts")
  async getUserPosts(@Req() req) {
    const userPosts = this.postsService.getUserPosts(req.user.id);

    return userPosts;
  };

  // Patch seria algo que faz um update, mas não completo
  // Também podemos usar o Put, mas ele é mais usado para quando vai atualizar tudo
  @Patch("update-post")
  async updatePost(@Req() req, @Body() updatePostDto: updatePostDto) {
    const updatedPost = this.postsService.updatePost(req.user.id, updatePostDto.idPost, updatePostDto.title, updatePostDto.content);

    return updatedPost;
  };

  @Delete("delete-post")
  async deletePost(@Req() req, @Body() post: deletePostDto) {
    const deletedPost = this.postsService.deletePost(req.user.id, post.postId);

    return deletedPost;
  };
};