import { IAcademic } from "@/types/Academic.type";
import { model, Schema } from "mongoose";

const AcademicSchema = new Schema<IAcademic>(
  {
    department: [
      {
        title: { type: String, required: true },
      },
    ],
    course: [
      {
        title: { type: String, required: true },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

AcademicSchema.index({ department: 1, course: 1, isActive: 1 });

export const Academic = model<IAcademic>("Academic", AcademicSchema);
