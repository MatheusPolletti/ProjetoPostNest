import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PostsService } from './posts.service';
import { ReactionType } from "@prisma/client";

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
    async likePost(@MessageBody() payload: { postId: number, userId: number, reactionType: ReactionType }) {
        const likesPost = await this.postsService.likePost(payload.postId, payload.userId, payload.reactionType);

        // Para enviar para quem mandou o pedido
        // client.emit

        this.server.emit('like', likesPost);
    };

    @SubscribeMessage("dislike")
    async dislikePost(@MessageBody() payload: { postId: number, userId: number, reactionType: ReactionType }) {
        const dislikedPost = await this.postsService.dislikePost(payload.postId, payload.userId, payload.reactionType);

        this.server.emit('dislike', dislikedPost);
    };
};