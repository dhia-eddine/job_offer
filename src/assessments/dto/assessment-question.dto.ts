import { IsNotEmpty, IsString, IsArray, ArrayMinSize, ArrayMaxSize, Min, Max } from 'class-validator';

export class AssessmentQuestionDto {
  @IsNotEmpty()
  @IsString()
  
  question: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  answers: string[];

  @IsNotEmpty()
  @Min(0)
  correctAnswerIndex: number;
}
