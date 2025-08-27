import { IsNumber } from "class-validator";

export class deletePostDto {
    @IsNumber()
    postId: number;
};