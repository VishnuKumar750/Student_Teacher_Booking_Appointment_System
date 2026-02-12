import mongoose from "mongoose";

// example roll format: CSE-2026-0007
export const generateUniqueRollNo = ({
  departmentCode,
  year,
  studentCount,
}: {
  departmentCode: string;
  year: number;
  studentCount: number;
}) => {
  const padded = String(studentCount + 1).padStart(4, "0");
  return `${departmentCode}-${year}-${padded}`;
};

export const isValidObjectId = (id: string) =>
  mongoose.Types.ObjectId.isValid(id);

export const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);
