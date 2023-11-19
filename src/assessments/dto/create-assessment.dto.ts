import { AssessmentQuestionDto } from "./assessment-question.dto";

export class CreateAssessmentDto {
  questions: AssessmentQuestionDto[];
  passingScore: number;
  timeLimitMinutes: number;
}
