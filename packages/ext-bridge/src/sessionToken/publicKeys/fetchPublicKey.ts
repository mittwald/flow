import { MW_EXT_API_URL } from "@/environment";
import axios from "axios";

interface ApiResponse {
  algorithm: string;
  key: string;
  serial: string;
}

export const fetchPublicKey = async (serial: string) => {
  const response = await axios<ApiResponse>({
    url: `https://${MW_EXT_API_URL}/v2/webhook-public-keys/${serial}`,
    validateStatus: (status) => status === 200,
  });
  return response.data;
};
