import { Request, Response } from "express";
import {
  createAcademic,
  getAllAcademics,
  getAcademicById,
  updateAcademic,
  deleteAcademic,
} from "@/services/academic.service";

export const createAcademicController = async (req: Request, res: Response) => {
  try {
    const academic = await createAcademic(req.body);
    res.status(201).json({ success: true, data: academic });
  } catch (error) {
    res.status(500).json({ success: false, message: "Create failed" });
  }
};

export const getAllAcademicsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const academics = await getAllAcademics();
    res.status(200).json({ success: true, data: academics });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

export const getAcademicByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const academic = await getAcademicById(req.params.id);
    if (!academic) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: academic });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

export const updateAcademicController = async (req: Request, res: Response) => {
  try {
    const academic = await updateAcademic(req.params.id, req.body);
    res.status(200).json({ success: true, data: academic });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

export const deleteAcademicController = async (req: Request, res: Response) => {
  try {
    const academic = await deleteAcademic(req.params.id);
    res.status(200).json({ success: true, data: academic });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
