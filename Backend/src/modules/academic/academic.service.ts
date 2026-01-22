import { Academic } from "@/models/Academic.model";
import { IAcademic } from "@/types/Academic.type";

export const createAcademic = async (data: Partial<IAcademic>) => {
  return Academic.create(data);
};

export const getAllAcademics = async () => {
  return Academic.find({ isActive: true });
};

export const getAcademicById = async (id: string) => {
  return Academic.findById(id);
};

export const updateAcademic = async (id: string, data: Partial<IAcademic>) => {
  return Academic.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAcademic = async (id: string) => {
  return Academic.findByIdAndUpdate(id, { isActive: false }, { new: true });
};
