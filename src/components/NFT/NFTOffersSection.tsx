'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Tag } from "lucide-react";
import { acceptOffer, getAllValidOffers } from "../../../lib/marketplacev3";
import { Offer } from "thirdweb/extensions/marketplace";
import { dateTime } from "@lens-protocol/client";
import { useThirdwebWallet } from "@/hooks/useThirdwebWallet";
import { useActiveAccount } from "thirdweb/react";

export default function NFTOffersSection({ collectionAddress, tokenId, isOwner }: { collectionAddress: string, tokenId: bigint, isOwner: boolean }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  useThirdwebWallet();
  const account  = useActiveAccount();

  useEffect(() => {
    async function fetchOffers() {
      try {
        // todo: tentar mover esse método para um server component
        const res = await getAllValidOffers(collectionAddress, tokenId);
        console.log("valid offers: ", res);
        setOffers(res);
      } catch (err) {
        console.error("Failed to load offers", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, [collectionAddress]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-[#F7E5F2] rounded-lg border-4 border-black p-6 animate-pulse">
        <h2 className="text-2xl font-black mb-4 flex items-center">
          <Tag className="mr-2 h-6 w-6" /> Offers
        </h2>
        <p className="text-gray-500">Loading offers...</p>
      </div>
    );
  }

  async function handleAcceptOffer(offer: Offer): Promise<void> {
    await acceptOffer(account, offer.id).then((tx) => {
      console.log("acceptOffer tx: ", tx);
    }).catch((err) => {
      console.error("acceptOffer error: ", err);
    });
  }

  return (
    <div className="bg-gradient-to-br from-white to-[#F7E5F2] rounded-lg border-4 border-black p-6">
      <h2 className="text-2xl font-black mb-4 flex items-center">
        <Tag className="mr-2 h-6 w-6" /> Offers
      </h2>

      {offers.length > 0 ? (
        <div className="space-y-3">
          {offers.map((offer, index) => (
            <div key={index} className="p-4 border-2 border-black rounded-md bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-black text-lg">{offer.currencyValue.displayValue} {offer.currencyValue.symbol}</span>
                <span className="text-sm text-gray-600">
                  Expires in{" "}
                  {(() => {
                  const now = new Date();
                  const endTime = new Date(Number(offer.endTimeInSeconds) * 1000);
                  const diffInSeconds = Math.floor((endTime.getTime() - now.getTime()) / 1000);

                  if (diffInSeconds <= 0) return "expired";

                  const days = Math.floor(diffInSeconds / (24 * 60 * 60));
                  const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
                  const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
                  const seconds = diffInSeconds % 60;

                  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
                  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
                  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
                  return `${seconds} second${seconds > 1 ? "s" : ""}`;
                  })()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-black mr-2">
                          <img
                            src={"/placeholder.png"}
                            alt={offer.offerorAddress}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link href={"#"} className="font-bold hover:underline">
                            {offer.offerorAddress.slice(0, 6)}...{offer.offerorAddress.slice(-4)}
                          </Link>
                        
                        </div>
                      </div>
                      {isOwner ? (
                  <button onClick={() => handleAcceptOffer(offer)} className="bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-bold py-2 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none flex items-center">
                    <Check className="mr-1 h-4 w-4" /> ACCEPT OFFER
                  </button>
                ) : (<span className="text-sm text-gray-600 ml-auto">{new Date(Number(offer.endTimeInSeconds) * 1000).toLocaleString()}
                </span>)}
                    </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No offers yet</p>
      )}
    </div>
  );
}
