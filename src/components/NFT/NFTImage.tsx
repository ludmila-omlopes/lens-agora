import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { resolveScheme } from 'thirdweb/storage';
import { thirdwebClient } from '../../../lib/client/thirdwebClient';

export const NFTImage = ({ imageUrl, nftName }: { imageUrl: string; nftName: string }) => {
    const resolvedImageurl = resolveScheme({ uri: imageUrl, client: thirdwebClient });
  return (
    <div>
      <img src={resolvedImageurl} alt={nftName} width={500} height={500} className="rounded-lg shadow-2xl w-full" />
    </div>
  );
};
