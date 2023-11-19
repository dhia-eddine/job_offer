import { IsNotEmpty, IsString, IsDate, IsDateString } from 'class-validator';

export class CreateJobOfferDto {
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  applicationDeadline: string;
}