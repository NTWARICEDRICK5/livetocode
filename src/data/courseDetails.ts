import type { CourseDetail, CourseDetailMap } from "@/data/courseDetailTypes";
import { batch1 } from "@/data/details/batch1";
import { batch2 } from "@/data/details/batch2";
import { batch3 } from "@/data/details/batch3";
import { batch4 } from "@/data/details/batch4";
import { batch5 } from "@/data/details/batch5";

export type { CourseDetail, CourseExercise, CourseProject, CourseResource } from "@/data/courseDetailTypes";

export const courseDetails: CourseDetailMap = {
  ...batch1,
  ...batch2,
  ...batch3,
  ...batch4,
  ...batch5,
};

export const getCourseDetail = (id: string): CourseDetail | undefined => courseDetails[id];
