import { Module } from '@nestjs/common';
import { JobOffersService } from './job-offers.service';
import { JobOffersController } from './job-offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOffer } from './job-offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobOffer])],
  providers: [JobOffersService],
  controllers: [JobOffersController],
  exports: [JobOffersService], // Export the service if needed in other modules
})
export class JobOffersModule {}
