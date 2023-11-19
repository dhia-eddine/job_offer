import { Assessment } from 'src/assessments/assessment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class JobOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  jobTitle: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  applicationDeadline: Date;

  @Column({ default: true })
  open: boolean;

  @CreateDateColumn()
  createdAt: Date;
  @OneToOne(() => Assessment)
  @JoinColumn()
  assessment: Assessment;
}
