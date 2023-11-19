import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { JobOffer } from './job-offer.entity';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';

@Injectable()
export class JobOffersService {
  constructor(
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
  ) {}

  async createJobOffer(
    createJobOfferDto: CreateJobOfferDto,
  ): Promise<JobOffer> {
    const { jobTitle, description, applicationDeadline } = createJobOfferDto;
    const currentDate = new Date();
    const deadlineDate = new Date(applicationDeadline);
    if (deadlineDate <= currentDate) {
      throw new BadRequestException(
        'Application deadline must be later than the current date',
      );
    }
    const jobOffer = this.jobOfferRepository.create({
      jobTitle,
      description,
      applicationDeadline: deadlineDate,
    });
    return this.jobOfferRepository.save(jobOffer);
  }

  async getAllJobOffers(
    page: number = 1,
    limit: number = 10,
  ): Promise<JobOffer[]> {
    const skip = (page - 1) * limit;
    return this.jobOfferRepository.find({ take: limit, skip });
  }

  async getJobOfferById(id: number): Promise<JobOffer> {
    const findOneOptions = { where: { id } };
    const jobOffer = await this.jobOfferRepository.findOne(findOneOptions);
    if (!jobOffer) {
      throw new NotFoundException('Job offer not found');
    }
    return jobOffer;
  }

  async updateJobOffer(
    id: number,
    updateJobOfferDto: UpdateJobOfferDto,
  ): Promise<JobOffer> {
    const jobOffer = await this.getJobOfferById(id);
    const { jobTitle, description, applicationDeadline, isOpen } =
      updateJobOfferDto;

    jobOffer.jobTitle = jobTitle;
    jobOffer.description = description;
    jobOffer.applicationDeadline = new Date(applicationDeadline);
    jobOffer.open = isOpen;

    return this.jobOfferRepository.save(jobOffer);
  }

  async closeJobOffer(id: number): Promise<JobOffer> {
    const jobOffer = await this.getJobOfferById(id);
    jobOffer.open = false;
    return this.jobOfferRepository.save(jobOffer);
  }

  async openJobOffer(id: number): Promise<JobOffer> {
    const jobOffer = await this.getJobOfferById(id);
    jobOffer.open = true;
    return this.jobOfferRepository.save(jobOffer);
  }

  async deleteJobOffer(id: number): Promise<string> {
    const jobOffer = await this.getJobOfferById(id);

    const applicationDeadline = new Date(jobOffer.applicationDeadline);
    if (jobOffer.open && new Date() <= applicationDeadline) {
      throw new BadRequestException('Job offer cannot be deleted');
    }

    const result = await this.jobOfferRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Job offer not found');
    }
    return 'successfully deleted';
  }
  async getOpenJobOffers(): Promise<JobOffer[]> {
    const today = new Date();
    return this.jobOfferRepository.find({
      where: {
        open: true,
        applicationDeadline: MoreThan(today),
      },
      select: ['jobTitle', 'description', 'applicationDeadline'],
    });
  }
}
