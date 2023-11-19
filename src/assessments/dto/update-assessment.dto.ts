import { IsNumber, IsOptional, Min, Max } from 'class-validator';
export class UpdateAssessmentDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  timeLimitMinutes?: number;
}
