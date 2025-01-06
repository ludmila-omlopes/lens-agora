import { getCurrentCollection, listNFTs } from "../../../../lib/nfts";
import CollectionClient from "./collectionClient";

export default async function CollectionPage({ params }: { params: { address: string, id: string } }) {

 const collection = await getCurrentCollection({ contractAdd: params.address });
 const nfts = await listNFTs({ contractAdd: params.address, start: 0, count: 10 });
 
  return ( <CollectionClient collectionContract={collection!} firstNFTs={nfts!}/> );
}