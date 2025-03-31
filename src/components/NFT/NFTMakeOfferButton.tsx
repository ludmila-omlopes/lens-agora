"use client";

import { useCallback } from "react";
import { getListing, makeOffer } from "thirdweb/extensions/marketplace";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { TransactionButton, TransactionButtonProps, useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { Chain, getContract, ThirdwebClient } from "thirdweb";

export type MakeOfferButtonProps = Omit<TransactionButtonProps, "transaction"> & {
  contractAddress: string;
  chain: Chain;
  client: ThirdwebClient;
  listingId: bigint;
  quantity?: bigint;
  offerAmount: string;
  expiration: Date;
};

export function MakeOfferButton(props: MakeOfferButtonProps) {
  const {
    contractAddress,
    listingId,
    children,
    chain,
    client,
    quantity = 1n,
    offerAmount,
    expiration,
    payModal,
  } = props;

  const account = useActiveAccount();
  const contract = getContract({
    address: contractAddress,
    client,
    chain,
  });

  const { mutateAsync } = useSendAndConfirmTransaction();

  const prepareOfferTransaction = useCallback(async () => {
    if (!account) throw new Error("No account detected");

    const [listing] = await Promise.all([
      getListing({ contract, listingId })
    ]);

    if (!listing) throw new Error(`Listing ${listingId} not found`);

    const offerTx = makeOffer({
      contract,
      quantity,
      currencyContractAddress: "0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8",  // weth. Todo: get from user
      totalOffer: offerAmount.toString(),
      offerExpiresAt: expiration,
      assetContractAddress: listing.assetContractAddress,
        tokenId: listing.tokenId,
    });

    const approveTx = await getApprovalForTransaction({ transaction: offerTx, account });
    if (approveTx) {
      await mutateAsync(approveTx);
    }

    return offerTx;
  }, [account, contract, listingId, quantity, offerAmount, expiration, mutateAsync]);

  return (
    <TransactionButton
      transaction={() => prepareOfferTransaction()}
      payModal={payModal}
      {...props}
    >
      {children}
    </TransactionButton>
  );
}
