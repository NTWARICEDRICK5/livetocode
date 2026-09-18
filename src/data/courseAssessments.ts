import type { CourseAssessment, CourseAssessmentMap } from "@/data/courseLabTypes";
import set1 from "@/data/assessments/set1";
import set2 from "@/data/assessments/set2";
import set3 from "@/data/assessments/set3";
import set4 from "@/data/assessments/set4";
import set5 from "@/data/assessments/set5";

export type { CourseLab, CourseAssessment } from "@/data/courseLabTypes";

export const courseAssessments: CourseAssessmentMap = {
  ...set1,
  ...set2,
  ...set3,
  ...set4,
  ...set5,
};

export const getCourseAssessment = (id: string): CourseAssessment | undefined =>
  courseAssessments[id];
