"use client"

import React, { useEffect, useState } from 'react';
import { lensPublicClient } from '../../../lib/client/lensProtocolClient';
import { currentSession } from "@lens-protocol/client/actions";
import { useAccount } from 'wagmi';

export type ChainIdProps = {
  chainid: `0x${string}`;
  health: boolean;
};

const ClientTest = ({ chainid, health }: ChainIdProps) => {
  const [sessionClient, setSessionClient] = useState<any>(null);
  const [sessionError, setSessionError] = useState<null | Error>(null);
  const account = useAccount();

  useEffect(() => {
    const manageSession = async () => {
      const resumed = await lensPublicClient?.resumeSession();

      if (resumed && resumed.isErr()) {
        console.log(resumed.error);
        setSessionError(resumed.error);
      } else {
        const sessionClient = resumed?.value;
        setSessionClient(sessionClient);

        const result = await currentSession(sessionClient);

        if (result.isErr()) {
          console.error(result.error);
          setSessionError(result.error);
        }
      }
    };

    manageSession();
  }, [account]);

  return (
    <div>
      <p>Hello, this is a test page!</p>
      <p>Chain ID: {chainid}</p>
      <p>Health test: {String(health)}</p>
      {sessionError && <p>Error: {sessionError.message}</p>}
    </div>
  );
};

export default ClientTest;