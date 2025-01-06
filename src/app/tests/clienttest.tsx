import React from 'react';
import { getNFTs } from "thirdweb/extensions/erc1155";
import { lensPublicClient } from '../../../lib/client/lensProtocolClient';

export type ChainIdProps = {
    chainid: `0x${string}`
    health: boolean
  };

const resumed = await lensPublicClient?.resumeSession();

if (resumed && resumed.isErr()) {
  console.log(resumed.error);
}else {
  const sessionClient = resumed?.value;
  console.log("sessionClient: ", sessionClient);
}

const ClientTest = ({ chainid, health } : ChainIdProps) => {
    console.log("health: ", health);
    return (
        <div>
            <p>Hello, this is a test page!</p>
            <p>Chain ID: {chainid}</p>

            <p>Health test: {String(health)} </p>
        </div>
    );
};

export default ClientTest;