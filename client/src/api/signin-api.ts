import api from "@/axios/axios-api";

type LoginPayload = {
  email: string;
  password: string;
};

type AuthUser = {
  id: string;
  role: "admin" | "teacher" | "student";
  email: string;
  name: string;
};

export const signIn = async (payload: LoginPayload): Promise<AuthUser> => {
  const { data } = await api.post("/auth/signin", payload, {
    withCredentials: true,
  });
  return data.data;
};
