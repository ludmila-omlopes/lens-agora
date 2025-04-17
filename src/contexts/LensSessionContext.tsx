"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { lensPublicClient } from "../../lib/client/lensProtocolClient";
import { currentSession } from "@lens-protocol/client/actions";
import type { SessionClient, AuthenticatedSession } from "@lens-protocol/client";
import { signMessage } from '@wagmi/core'
import { config } from "@/app/Web3Provider";

type LensSessionContextType = {
  session: AuthenticatedSession | null;
  sessionClient: SessionClient | null;
  loading: boolean;
  login: (config: any, lensAccount: any, appAddress: string, accountAddress: string) => Promise<void>;
  logout: () => Promise<void>;
  resume: () => Promise<void>;
  loginAsOnboardingUser: (params: {
    appAddress: string;
    walletAddress: string;
  }) => Promise<void>;
};

const LensSessionContext = createContext<LensSessionContextType | undefined>(undefined);

export const LensSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionClient, setSessionClient] = useState<SessionClient | null>(null);
  const [session, setSession] = useState<AuthenticatedSession | null>(null);
  const [loading, setLoading] = useState(true);

  const resume = useCallback(async () => {
    const resumed = await lensPublicClient.resumeSession();
    if (resumed.isErr()) {
      setSessionClient(null);
      setSession(null);
      setLoading(false);
      return;
    }

    const client = resumed.value;
    setSessionClient(client);

    const result = await currentSession(client);
    if (result.isOk()) {
      setSession(result.value);
    }

    setLoading(false);
  }, []);

  const loginWithLens = useCallback(async (config: any, lensAccount: any, appAddress: string, accountAddress: string) => {
    const authenticated = await lensPublicClient.login({
      accountOwner: {
        account: lensAccount.address,
        app: appAddress,
        owner: accountAddress,
      },
      signMessage: (message: string) => signMessage(config, { message }),
    });
  
    if (authenticated.isErr()) {
      console.error("Login failed:", authenticated.error);
      return;
    }
  
    await resume();
  }, [resume]);
  

  const logout = useCallback(async () => {
    if (sessionClient) {
      await sessionClient.logout();
    } else {
      const resumed = await lensPublicClient.resumeSession();
      if (resumed.isOk()) {
        await resumed.value.logout();
      }
    }
  
    setSessionClient(null);
    setSession(null);
  }, [sessionClient]);

  const loginAsOnboardingUser = useCallback(
    async ({
      appAddress,
      walletAddress,
    }: {
      appAddress: string;
      walletAddress: string;
    }) => {
      const authenticated = await lensPublicClient.login({
        onboardingUser: {
          app: appAddress,
          wallet: walletAddress,
        },
        signMessage: (message: string) => signMessage(config, { message }),
      });
  
      if (authenticated.isErr()) {
        console.error("Onboarding login failed:", authenticated.error);
        return;
      }
  
      const client = authenticated.value;
      setSessionClient(client);
  
      const result = await currentSession(client);
      if (result.isOk()) {
        setSession(result.value);
      }
    },
    []
  );
  

  useEffect(() => {
    resume();
  }, [resume]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Triggered only on the client
    setIsClient(true);
  }, []);

  if (!isClient) return null; // or return a loader

  return (
    <LensSessionContext.Provider value={{ 
        session, 
        sessionClient, 
        loading, 
        login: loginWithLens, 
        loginAsOnboardingUser,
        logout, 
        resume }}>
      {children}
    </LensSessionContext.Provider>
  );
};

export function useLensSession(): LensSessionContextType {
  const context = useContext(LensSessionContext);
  if (!context) {
    throw new Error("useLensSession must be used within a LensSessionProvider");
  }
  return context;
}
