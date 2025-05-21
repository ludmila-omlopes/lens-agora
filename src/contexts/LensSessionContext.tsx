"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { lensPublicClient } from "../../lib/client/lensProtocolClient";
import { currentSession, fetchAccount } from "@lens-protocol/client/actions";
import type { SessionClient, AuthenticatedSession, Account, AuthenticatedUser } from "@lens-protocol/client";
import { Role } from "@lens-protocol/client";
import { signMessage } from '@wagmi/core'
import { config } from "@/app/Web3Provider";
import { account } from "@lens-protocol/metadata";

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
  getLoggedAccount: () => Promise<Account | null>;
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

  const getLoggedAccount = useCallback(async (): Promise<Account | null> => {
    if (!sessionClient || !sessionClient.isSessionClient()) 
      return null;
    try {
      const result = sessionClient.getAuthenticatedUser();
      if (result.isErr()) {
        console.error("Failed to get logged user:", result.error);
        return null;
      }
      const user = result.value as AuthenticatedUser;
      if (!user || user.role === Role.OnboardingUser || user.role === Role.Builder) {
        console.error("User is not authenticated or is an onboarding user:", user);
        return null;
      }
      
      const result2 = await fetchAccount(lensPublicClient, {
        address: user.address,
      });

      if (result2.isErr()) {
        console.error("Failed to fetch logged account:", result2.error);
        return null;  
      };

      const account = result2.value as Account;

      return account;
    } catch (error) {
      console.error("Failed to fetch logged account:", error);
      return null;
    }
  }, [sessionClient]);
  

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
        getLoggedAccount,
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
