import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { JobOffer } from '../job-offers/job-offer.entity';
import { AssessmentQuestion } from './assessment-question.entity';

@Entity()
export class Assessment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => JobOffer)
  @JoinColumn()
  jobOffer: JobOffer;

  @OneToMany(() => AssessmentQuestion, (question) => question.assessment, {
    cascade: true,
  })
  questions: AssessmentQuestion[];

  @Column('integer')
  passingScore: number;

  @Column('integer')
  timeLimitMinutes: number;
}
