import { UserModel } from "../user/user.model";

export const createTeacher = async (data: any) => {
  return UserModel.create({
    ...data,
    roles: "TEACHER",
  });
};

export const getAllTeachers = async () => {
  return UserModel.find({ roles: "TEACHER" });
};

export const getTeacherById = async (id: string) => {
  return UserModel.findOne({ _id: id, roles: "TEACHER" });
};

export const updateTeacher = async (id: string, data: any) => {
  return UserModel.findOneAndUpdate({ _id: id, roles: "TEACHER" }, data, {
    new: true,
  });
};

export const approveTeacher = async (id: string) => {
  return UserModel.findOneAndUpdate(
    { _id: id, roles: "TEACHER" },
    { isApproved: true },
    { new: true },
  );
};

export const deleteTeacher = async (id: string) => {
  return UserModel.findOneAndUpdate(
    { _id: id, roles: "TEACHER" },
    { status: "INACTIVE" },
    { new: true },
  );
};
