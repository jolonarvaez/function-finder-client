import api from "@/lib/axios";

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

type ApiLoginResponse = {
  status: number;
  message: string;
  data: LoginResponse;
};

export async function loginWithEmail(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<ApiLoginResponse>("/auth/login", { email, password });
  return data.data;
}
