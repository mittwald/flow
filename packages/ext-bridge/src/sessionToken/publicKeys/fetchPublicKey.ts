import { MW_EXT_API_URL } from "@/environment";
import { ExtBridgeError } from "@/error";
import axios from "axios";

interface ApiResponse {
  algorithm: string;
  key: string;
  serial: string;
}

export const fetchPublicKey = async (serial: string) => {
  const response = await axios<ApiResponse>({
    url: `${MW_EXT_API_URL}/v2/public-keys/${encodeURIComponent(serial)}`,
    validateStatus: (status) => status === 200,
    params: {
      format: "spki",
      purpose: "session_token",
    },
  });

  if (
    typeof response.data !== "object" ||
    response.data === null ||
    typeof response.data.key !== "string" ||
    response.data.key.length === 0
  ) {
    throw new ExtBridgeError("Public key response invalid");
  }

  return response.data.key;
};
