import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PostsService } from './posts.service';

const FRONTEND_URL = process.env.FRONTEND_URL;

@WebSocketGateway({
    cors: {
        origin: FRONTEND_URL,
        credentials: true,
    },
})

@WebSocketGateway()
export class PostsGateway {
    constructor(private readonly postsService: PostsService) { }
    @WebSocketServer()
    server;

    @SubscribeMessage("like")
    async likePost(@MessageBody() payload: { postId: number }) {
        const likesPost = await this.postsService.likePost(payload.postId);

        // Para enviar para quem mandou o pedido
        // client.emit

        this.server.emit('like', likesPost);
    };

    @SubscribeMessage("dislike")
    async dislikePost(@MessageBody() payload: { postId: number }) {
        const dislikedPost = await this.postsService.dislikePost(payload.postId);

        this.server.emit('dislike', dislikedPost);
    };
};