import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdateJobOfferDto {
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  applicationDeadline: string;

  @IsNotEmpty()
  @IsBoolean()
  isOpen: boolean;
}
