// src/client.ts
import { createThirdwebClient } from "thirdweb";

export const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const thirdwebClientServer = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});