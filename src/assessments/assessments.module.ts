import { Module } from '@nestjs/common';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from './assessment.entity'; // Import your Assessment entity
import { JobOffersModule } from 'src/job-offers/job-offers.module';
import { AssessmentQuestion } from './assessment-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment,AssessmentQuestion]),JobOffersModule], // Add your Assessment entity to the forFeature array
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [AssessmentsService], // Export the service if needed in other modules
})
export class AssessmentsModule {}
