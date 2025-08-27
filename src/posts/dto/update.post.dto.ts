import { IsString, IsNumber } from "class-validator";

export class updatePostDto {
    @IsNumber()
    idPost: number;

    @IsString()
    title: string;

    @IsString()
    content: string;
};