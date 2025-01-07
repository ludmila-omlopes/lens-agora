'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Flag } from 'lucide-react';
import { NFT } from 'thirdweb';
import { resolveScheme } from 'thirdweb/storage';
import { thirdwebClient } from '../../../../../lib/client/thirdwebClient';
import Link from 'next/link';
import { marketplaceContractAddress } from '../../../../../lib/marketplacev3';
import { CreateDirectListingButton, useActiveAccount, BuyDirectListingButton, useSocialProfiles } from 'thirdweb/react';
import { lensTestnetChain } from '../../../../../lib/lensNetwork';
import { DirectListing } from 'thirdweb/extensions/marketplace';
import { isNFTOwnedByAddress } from '../../../../../lib/nfts';
import { Collection, MarketplaceInfo } from '../../../../../lib/types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function NFTDetailsClient({
  nft,
  collection,
  marketplaceInfo,
}: {
  nft: NFT;
  collection: Collection;
  marketplaceInfo: MarketplaceInfo;
}) {
  const [isOwner, setIsOwner] = useState(false);
  const account = useActiveAccount();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: profiles,  } = useSocialProfiles({
    client: thirdwebClient,
    address: account?.address,  //da pra substituir pelo family connectkit aqui
  });

  console.log('profiles', profiles);

  const [listingDetails, setListingDetails] = useState({
    price: 1,
    startTime: new Date().toISOString().slice(0, 16),
    endTime: '',
    currency: 'GRASS',
    quantity: 1,
  });

  const imageurl = resolveScheme({ uri: nft.metadata.image!, client: thirdwebClient });
  const supply = nft.type === 'ERC1155' ? nft.supply.toString() : '1';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setListingDetails((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const checkOwnership = async () => {
      if (account && account.address) {
        const userIsOwner = await isNFTOwnedByAddress(account.address, nft, collection.address);
        setIsOwner(userIsOwner);
      }
    };
    checkOwnership();
  }, [account, nft]);

  return (
    <div className="min-h-screen bg-purple-100 text-purple-900 p-8 [&_*]:shadow-cartoon">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border-4 border-pink-400 overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              src={imageurl}
              alt={nft.metadata.name!}
              width={600}
              height={600}
              className="h-full w-full object-cover md:w-96"
            />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-purple-600 mb-2">{nft.metadata.name!}</h1>
                <p className="text-purple-400 mb-4">
                  From the{' '}
                  <Link
                    href={`/items/${collection.address}`}
                    className="font-bold hover:text-purple-600 transition-colors"
                  >
                    {collection.name}
                  </Link>{' '}
                  collection
                </p>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500">
                #{nft.id.toString()}
              </Badge>
            </div>

            <div className="flex items-center mb-4">
              {nft.type === 'ERC1155' && (
                <div className="mr-4">
                  <p className="text-sm text-purple-400">Supply</p>
                  <p className="font-bold text-purple-600">{supply}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-purple-400">Owned by</p>
                <p className="font-bold text-purple-600">{isOwner ? 'you' : nft.owner}</p>
              </div>
            </div>

            {!marketplaceInfo && isOwner && (
                  <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                  List for Sale
                </Button>
            )}

            {marketplaceInfo && (
            <div className="mb-6">
              <p className="text-xl font-bold text-green-500 mb-2">Marketplace Info</p>
              {marketplaceInfo.listing.status === 'ACTIVE' && (
                <div>
                  <p className="text-lg font-bold text-purple-600 mb-2">
                    Price: {marketplaceInfo.listing.currencyValuePerToken.displayValue}{' '}
                    {marketplaceInfo.listing.currencyValuePerToken.symbol}
                  </p>
                  {isOwner ? (
                    <Button variant="outline" onClick={() => console.log('Cancel listing logic')}>
                      Cancel Listing
                    </Button>
                  ) : (
                    <BuyDirectListingButton
                      contractAddress={marketplaceContractAddress}
                      chain={lensTestnetChain}
                      client={thirdwebClient}
                      listingId={marketplaceInfo.listing.id}
                      quantity={1n}
                    >
                      Buy NFT
                    </BuyDirectListingButton>
                  )}
                </div>
              )}
              {marketplaceInfo.listing.status === 'CREATED' && (
                <div>
                  {isOwner ? (
                    <div className="space-y-2">
                      <Button variant="outline" onClick={() => console.log('Cancel listing logic')}>
                        Cancel Listing
                      </Button>
                      <p className="text-sm text-gray-500">
                        Starts in:{' '}
                        {new Date( Number(marketplaceInfo.listing.startTimeInSeconds) * 1000).toLocaleString()}
                      </p>
                    </div>
                    
                  ) : (
                    <div className="space-y-2">
                      <Button variant="outline" disabled>
                        Buy NFT (Not yet available)
                      </Button>
                      <p className="text-sm text-gray-500">
                        Starts in:{' '}
                        {new Date( Number(marketplaceInfo.listing.startTimeInSeconds) * 1000).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
         ) }

            <div className="mb-6">
              <h2 className="text-xl font-bold text-purple-600 mb-2">Description</h2>
              <p className="text-purple-500">{nft.metadata.description!}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-purple-600 mb-2">Traits</h2>
              <div className="grid grid-cols-2 gap-4">
                {Array.isArray(nft.metadata.attributes) &&
                  nft.metadata.attributes.map((trait, index) => (
                    <div key={index} className="bg-yellow-100 rounded-lg p-2 text-center">
                      <p className="text-sm text-purple-400">{trait.trait_type}</p>
                      <p className="font-bold text-purple-600">{trait.value}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 flex justify-between items-center">
        <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
        <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
          <Flag className="mr-2 h-4 w-4" /> Report
        </Button>
      </div>

            {/* List for Sale Dialog */}
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>List NFT for Sale</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {/* Price Input */}
      <input
        type="text"
        name="price"
        placeholder="Price"
        className="w-full p-2 border rounded"
        value={listingDetails.price}
        onChange={handleInputChange}
      />

      {/* Start Time Input */}
      <input
        type="datetime-local"
        name="startTime"
        placeholder="Start Time"
        className="w-full p-2 border rounded"
        value={listingDetails.startTime}
        onChange={handleInputChange}
      />

      {/* Add End Date Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="addEndDate"
          checked={!!listingDetails.endTime}
          onChange={(e) =>
            setListingDetails((prev) => ({
              ...prev,
              endTime: e.target.checked ? new Date().toISOString().slice(0, 16) : '',
            }))
          }
        />
        <label htmlFor="addEndDate" className="text-purple-600">
          Add an end date
        </label>
      </div>

      {/* End Time Input (conditionally rendered) */}
      {listingDetails.endTime && (
        <input
          type="datetime-local"
          name="endTime"
          placeholder="End Time"
          className="w-full p-2 border rounded"
          value={listingDetails.endTime}
          onChange={handleInputChange}
        />
      )}

      {/* Currency Selector */}
      <select
        name="currency"
        className="w-full p-2 border rounded"
        value={listingDetails.currency}
        onChange={handleInputChange}
      >
        <option value="GRASS">GRASS</option>
        <option disabled value="GHO">
          GHO (soon)
        </option>
        <option disabled value="BONSAI">
          BONSAI (soon)
        </option>
      </select>

      {/* Quantity Input */}
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        className="w-full p-2 border rounded"
        value={listingDetails.quantity}
        onChange={handleInputChange}
        min="1"
      />
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
        Cancel
      </Button>
      <CreateDirectListingButton
        contractAddress={marketplaceContractAddress}
        chain={lensTestnetChain}
        client={thirdwebClient}
        tokenId={nft.id}
        assetContractAddress={collection.address}
        pricePerToken={listingDetails.price.toString()}
        startTimestamp={new Date(listingDetails.startTime)}
        endTimestamp={listingDetails.endTime ? new Date(listingDetails.endTime) : undefined}
        currencyContractAddress={undefined} // Replace with actual address for the selected currency
        quantity={BigInt(listingDetails.quantity)}
        onError={(err) => alert(err.message)}
        onTransactionConfirmed={() => setIsDialogOpen(false)}  //todo: melhorar a mensagem de sucesso
      >
        Confirm Listing
      </CreateDirectListingButton>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
}
