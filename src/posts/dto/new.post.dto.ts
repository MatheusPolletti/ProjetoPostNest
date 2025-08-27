import { IsString } from "class-validator";

export class newPostDto {
    @IsString()
    title: string;

    @IsString()
    content: string;
};