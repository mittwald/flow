import { MW_EXT_API_URL } from "@/environment";
import axios from "axios";

interface ApiResponse {
  expiry: string;
  publicToken: string;
}

export const getAccessToken = async (
  sessionToken: string,
  extensionSecret: string,
) => {
  const response = await axios<ApiResponse>({
    url: `${MW_EXT_API_URL}/v2/authenticate-session-token`,
    data: { sessionToken, extensionSecret },
    validateStatus: (status) => status === 201,
    method: "POST",
  });
  return response.data;
};
