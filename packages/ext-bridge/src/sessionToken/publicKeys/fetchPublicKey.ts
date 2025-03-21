import { debug } from "@/debug";
import { MW_EXT_API_URL } from "@/environment";
import axios from "axios";

interface ApiResponse {
  algorithm: string;
  key: string;
  serial: string;
}

export const fetchPublicKey = async (serial: string) => {
  const url = `https://${MW_EXT_API_URL}/v2/public-keys/${serial}`;

  debug("fetching public key from %s (serial: %s)", url, serial);
  const response = await axios<ApiResponse>({
    url,
    validateStatus: (status) => status === 200,
    params: {
      format: "spki",
      purpose: "session_key",
    },
  });
  return response.data.key;
};
