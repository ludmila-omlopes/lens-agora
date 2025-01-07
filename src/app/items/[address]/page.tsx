import { getCurrentCollection, listNFTs } from "../../../../lib/nfts";
import CollectionDetails from "./collectionClient";
import CollectionClient from "./collectionClient";

export default async function CollectionPage({ params }: { params: { address: string, id: string } }) {

 const collection = await getCurrentCollection({ contractAdd: params.address });
 const nfts = await listNFTs({ contractAdd: params.address, start: 0, count: 10 });
 
 return (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
    <div className="container mx-auto py-8 px-4">
      <CollectionDetails collectionContract={collection} firstNFTs={nfts!} />
    </div>
  </div>
)
}