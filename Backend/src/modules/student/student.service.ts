import { UserModel } from "../user/user.model";

export const createStudent = async (data: any) => {
  return UserModel.create({
    ...data,
    roles: "STUDENT",
  });
};

export const getAllStudents = async () => {
  return UserModel.find({ roles: "STUDENT" });
};

export const getStudentById = async (id: string) => {
  return UserModel.findOne({ _id: id, roles: "STUDENT" });
};

export const updateStudent = async (id: string, data: any) => {
  return UserModel.findOneAndUpdate({ _id: id, roles: "STUDENT" }, data, {
    new: true,
  });
};

export const deleteStudent = async (id: string) => {
  return UserModel.findOneAndUpdate(
    { _id: id, roles: "STUDENT" },
    { status: "INACTIVE" },
    { new: true },
  );
};
