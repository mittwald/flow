import { MW_EXT_API_URL } from "@/environment";
import axios from "axios";

interface ApiResponse {
  algorithm: string;
  key: string;
  serial: string;
}

export const fetchPublicKey = async (serial: string) => {
  const response = await axios<ApiResponse>({
    url: `${MW_EXT_API_URL}/v2/public-keys/${serial}`,
    validateStatus: (status) => status === 200,
    params: {
      format: "spki",
      purpose: "session_token",
    },
  });
  return response.data.key;
};
