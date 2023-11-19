import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Assessment } from './assessment.entity';

@Entity()
export class AssessmentQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column('text', { array: true })
  answers: string[];

  @Column()
  correctAnswerIndex: number;

  @ManyToOne(() => Assessment, (assessment) => assessment.questions)
  assessment: Assessment;
}
