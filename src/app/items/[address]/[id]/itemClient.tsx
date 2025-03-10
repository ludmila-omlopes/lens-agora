'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Share2, Flag, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SocialFeed from '@/components/SocialFeed'
import { NFT } from 'thirdweb'
import { resolveScheme } from 'thirdweb/storage'
import { Collection, MarketplaceInfo } from '../../../../../lib/types'
import { thirdwebClient } from '../../../../../lib/client/thirdwebClient'
import { BuyDirectListingButton, CreateDirectListingButton, useActiveAccount, useSocialProfiles } from 'thirdweb/react'
import { listAvailableLensAccounts } from '../../../../../lib/lensProtocolUtils'
import { get721NFTOwner, isNFTOwnedByAddress } from '../../../../../lib/nfts'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { marketplaceContractAddress } from '../../../../../lib/marketplacev3'
import { lensTestnetChain } from '../../../../../lib/lensNetwork'
import CountdownTimer from '@/components/CountdownTimer'
import { useAccount } from 'wagmi'
import { useThirdwebWallet } from '@/hooks/useThirdwebWallet'

//todo: testar listing agendada
//todo: cancel listing
//todo: se item ja teve listagem cancelada, vai ter mais de uma. tem q processar todas.
export default function NFTDetails({  nft,
    collection,
    marketplaceInfo }: { nft: NFT;
      collection: Collection;
      marketplaceInfo: MarketplaceInfo; }) {

       const history = [
            { event: "Minted", from: "StellarArtist", to: "StellarArtist", price: "1.0 ETH", date: "2023-05-01" },
            { event: "Listed", from: "StellarArtist", to: null, price: "2.5 ETH", date: "2023-05-15" },
            { event: "Bid", from: "ArtEnthusiast", to: null, price: "2.7 ETH", date: "2023-05-20" },
          ]

const [listingDetails, setListingDetails] = useState({
    price: 1,
    startTime: new Date().toISOString().slice(0, 16),
    endTime: '',
    currency: 'GRASS',
    quantity: 1,
  });

  const [isLiked, setIsLiked] = useState(false);
  const [nftOwner, setNftOwner] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const account = useAccount();
  useThirdwebWallet(); // Converts Wagmi wallet for Thirdweb use
  const TWaccount = useActiveAccount();
  console.log("TWaccount", TWaccount);

  const { data: artistProfiles,  } = useSocialProfiles({
      client: thirdwebClient,
      address: collection.owner,  //da pra substituir pelo family connectkit aqui
    });

    //const lensAccount = await listAvailableLensAccounts(collection.owner)

    const ensProfile = artistProfiles && artistProfiles.find(profile => profile.type === 'ens');

  const imageurl = resolveScheme({ uri: nft.metadata.image!, client: thirdwebClient });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setListingDetails((prev) => ({ ...prev, [name]: value }));
    };

  useEffect(() => {
      const getOwnership = async () => {
        if (nft.type === 'ERC721') {
          const owner = await get721NFTOwner(nft, collection.address);
          console.log("owner: ", owner)
          setNftOwner(owner?.owner!);
        }
      };
      getOwnership();
    }, [account, nft]);

    useEffect(() => {
        const checkOwnership = async () => {
          if (account && account.address) {
            const userIsOwner = await isNFTOwnedByAddress(account.address, nft, collection.address);
            console.log("userIsOwner: ", userIsOwner)
            setIsOwner(userIsOwner);
          }
        };
        checkOwnership();
      }, [account, nft]);

  return (
    <div className="bg-white bg-opacity-80 dark:bg-white dark:bg-opacity-10 rounded-lg p-8 backdrop-blur-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img 
                src={imageurl} 
                alt={nft.metadata.name} 
                width={500} 
                height={500} 
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="flex justify-between mt-4">
                <Button variant="outline" className="text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-purple-600" onClick={() => setIsLiked(!isLiked)}>
                  <Heart className={`mr-2 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button variant="outline" className="text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-purple-600">
                  <Share2 className="mr-2" />
                  Share
                </Button>
                <Button variant="outline" className="text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-purple-600">
                  <Flag className="mr-2" />
                  Report
                </Button>
              </div>
            </div>
            <div className="text-gray-800 dark:text-white">
              <Link href={`/items/${collection.address}`} className="inline-flex items-center text-pink-400 hover:text-pink-300 mb-2">
                <span>{collection.name}</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
              <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">{nft.metadata.name}</h1>
              <p className="mb-6 text-gray-800 dark:text-white">{nft.metadata.description}</p>
              <div className="flex items-center mb-6">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={ensProfile?.avatar} alt={ensProfile?.name} />
                  <AvatarFallback>O</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{ensProfile?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{ensProfile?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                { (nft.type === 'ERC721') && (
                <div> 
                  <p className="text-gray-500 dark:text-gray-400">Owner</p> {/*colocar link pra profile page*/ }
                  <p className="font-semibold text-gray-800 dark:text-white">{isOwner ? "You" : nftOwner?.substring(0,5)}</p>
                </div>
                )}
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Current Price</p>
                  <p className="font-semibold text-2xl text-gray-800 dark:text-white">{marketplaceInfo && marketplaceInfo.listing ? ((Number(marketplaceInfo.listing.pricePerToken) / 10**18).toString() + " GRASS") : "Not for Sale"}</p>
                </div>
                {/*<div>
                  <p className="text-gray-500 dark:text-gray-400">Highest Bid</p>
                  <p className="font-semibold text-2xl text-gray-800 dark:text-white">{}</p>
                </div>*/}
              </div>
              { marketplaceInfo && marketplaceInfo.listing && marketplaceInfo.listing.status === 'CREATED' && (
              <div className="mb-6">
                <p className="text-gray-500 dark:text-gray-400">Sale Starts in</p>
                <p className="font-semibold text-2xl text-gray-800 dark:text-white">
                  <CountdownTimer endTime={new Date( Number(marketplaceInfo.listing.startTimeInSeconds) * 1000).toLocaleString()} />
                </p>
              </div>
              )}
              <div className="flex space-x-4">
              {(!marketplaceInfo || marketplaceInfo.listing.status === "CANCELLED") && isOwner && (
                <Button  onClick={() => setIsDialogOpen(true)} className="flex-1 bg-pink-500 hover:bg-pink-600 text-gray-800 dark:text-white">List for Sale</Button>
              )}
              {
                marketplaceInfo && marketplaceInfo.listing && marketplaceInfo.listing.status != "CANCELLED" && isOwner && (
                    <Button  onClick={() => console.log('Cancel listing logic')} className="flex-1 bg-pink-500 hover:bg-pink-600 text-gray-800 dark:text-white">Cancel Listing</Button>
                )}
                { marketplaceInfo && marketplaceInfo.listing && marketplaceInfo.listing.status === 'ACTIVE' && !isOwner && (
                    <BuyDirectListingButton
                    contractAddress={marketplaceContractAddress}
                    chain={lensTestnetChain}
                    client={thirdwebClient}
                    listingId={marketplaceInfo.listing.id}
                    quantity={1n}
                >
                    Buy NFT
                </BuyDirectListingButton>
                )
                }
                {/*<Button className="flex-1 bg-purple-500 hover:bg-purple-600 text-gray-800 dark:text-white">Place Bid</Button>*/}
              </div>
            </div>
          </div>
          <Tabs defaultValue="history" className="mt-8">
            <TabsList className="bg-white bg-opacity-20">
              <TabsTrigger value="history" className="text-gray-800 dark:text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">History</TabsTrigger>
              <TabsTrigger value="bids" className="text-gray-800 dark:text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">Bids</TabsTrigger>
            </TabsList>
            <TabsContent value="history">
              <Card className="bg-white bg-opacity-80 dark:bg-white dark:bg-opacity-10 text-gray-800 dark:text-white">
                <CardContent className="p-4">
                  <ul>
                    {history.map((item, index) => (
                      <li key={index} className="mb-2 pb-2 border-b border-gray-600 last:border-b-0">
                        <p className="font-semibold text-gray-800 dark:text-white">{item.event}</p>
                        <p className="text-sm text-gray-800 dark:text-white">
                          From: {item.from} {item.to && `To: ${item.to}`}
                        </p>
                        <p className="text-sm text-gray-800 dark:text-white">Price: {item.price}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bids">
              <Card className="bg-white bg-opacity-80 dark:bg-white dark:bg-opacity-10 text-gray-800 dark:text-white">
                <CardContent className="p-4">
                  <p>Auctions will be implemented soon!</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-1">
          <SocialFeed />
        </div>
      </div>

     {/* List for Sale Dialog */}
     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>List NFT for Sale</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {/* Price Input */}
      Price
      <input
      type="text"
      name="price"
      placeholder="Price"
      className="w-full p-2 border rounded"
      value={listingDetails.price}
      onChange={handleInputChange}
      />

      {/* Start Time Input 
      <input
      type="datetime-local"
      name="startTime"
      placeholder="Start Time"
      className="w-full p-2 border rounded"
      value={listingDetails.startTime}
      onChange={handleInputChange}
      />*/}

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

      {/* Quantity Input (conditionally rendered) */}
      {nft.type === 'ERC1155' && (
      <>
        Quantity
        <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        className="w-full p-2 border rounded"
        value={listingDetails.quantity}
        onChange={handleInputChange}
        min="1"
        />
      </>
      )}
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
        //startTimestamp={new Date(listingDetails.startTime)}
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
  )
}

