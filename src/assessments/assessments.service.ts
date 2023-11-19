import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assessment } from './assessment.entity';
import { AssessmentQuestionDto } from './dto/assessment-question.dto';
import { JobOffer } from '../job-offers/job-offer.entity';
import { AssessmentQuestion } from './assessment-question.entity'; // Import your AssessmentQuestion entity

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentQuestion)
    private questionRepository: Repository<AssessmentQuestion>,
  ) {}

  async createAssessment(
    jobOffer: JobOffer,
    questions: AssessmentQuestionDto[],
    passingScore: number,
    timeLimitMinutes: number,
  ): Promise<Assessment> {
    const assessment = this.assessmentRepository.create({
      jobOffer,
      passingScore,
      timeLimitMinutes,
    });

    assessment.questions = []; // Initialize the questions array

    for (const questionDto of questions) {
      const question = this.questionRepository.create({
        question: questionDto.question,
        answers: questionDto.answers,
        correctAnswerIndex: questionDto.correctAnswerIndex,
      });
      assessment.questions.push(question);
    }

    return this.assessmentRepository.save(assessment);
  }
  async getAssessmentById(assessmentId: number): Promise<Assessment> {
    const assessment = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.questions', 'questions')
      .where('assessment.id = :assessmentId', { assessmentId })
      .getOne();

    if (!assessment) {
      throw new NotFoundException(
        `Assessment with ID ${assessmentId} not found`,
      );
    }

    return assessment;
  }
  // AssessmentsService

  async updateAssessment(
    assessmentId: number,
    passingScore: number,
    timeLimitMinutes: number,
  ): Promise<Assessment> {
    const assessment = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.questions', 'questions')
      .where('assessment.id = :assessmentId', { assessmentId })
      .getOne();

    if (!assessment) {
      throw new NotFoundException(`Assessment ${assessmentId} not found`);
    }

    assessment.passingScore = passingScore;
    assessment.timeLimitMinutes = timeLimitMinutes;

    return this.assessmentRepository.save(assessment);
  }

  async deleteAssessment(assessmentId: number): Promise<void> {
    const assessment = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.questions', 'questions')
      .where('assessment.id = :assessmentId', { assessmentId })
      .getOne();

    if (!assessment) {
      throw new NotFoundException(`Assessment ${assessmentId} not found`);
    }

    // Delete or disassociate assessment questions
    for (const question of assessment.questions) {
      await this.questionRepository.delete(question.id);
    }

    // Now you can safely delete the assessment
    await this.assessmentRepository.delete(assessmentId);
  }

  async addQuestionToAssessment(
    assessmentId: number,
    questionDto: AssessmentQuestionDto,
  ): Promise<Assessment> {
    const assessment = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.questions', 'questions')
      .where('assessment.id = :assessmentId', { assessmentId })
      .getOne();

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const newQuestion = this.questionRepository.create({
      question: questionDto.question,
      answers: questionDto.answers,
      correctAnswerIndex: questionDto.correctAnswerIndex,
      assessment, // Associate the new question with the assessment
    });

    assessment.questions.push(newQuestion);

    return this.assessmentRepository.save(assessment);
  }

  async getAssessmentQuestions(assessmentId: number): Promise<{
    assessmentId: number;
    passingScore: number;
    timeLimitMinutes: number;
    questions: AssessmentQuestionDto[];
  }> {
    const assessment = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.questions', 'questions')
      .where('assessment.id = :assessmentId', { assessmentId })
      .getOne();

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    return {
      assessmentId: assessment.id,
      passingScore: assessment.passingScore,
      timeLimitMinutes: assessment.timeLimitMinutes,
      questions: assessment.questions.map((question) => ({
        question: question.question,
        answers: question.answers,
        correctAnswerIndex: question.correctAnswerIndex,
      })),
    };
  }
  async deleteQuestionFromAssessment(
    assessmentId: number,
    questionId: number,
  ): Promise<void> {
    const assessment = await this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.questions', 'questions')
      .where('assessment.id = :assessmentId', { assessmentId })
      .getOne();

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const questionToRemove = assessment.questions.find(
      (q) => q.id === questionId,
    );

    assessment.questions = assessment.questions.filter(
      (q) => q !== questionToRemove,
    );
    await this.assessmentRepository.save(assessment);

    await this.questionRepository.delete(questionId);
  }
}
