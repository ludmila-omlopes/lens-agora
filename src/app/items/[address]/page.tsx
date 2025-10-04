import { revalidatePath } from "next/cache";
import { getCurrentCollection, listNFTs } from "../../../../lib/nfts";
import CollectionDetails from "./collectionClient";
import CollectionClient from "./collectionClient";
import { notFound, redirect } from "next/navigation";

export default async function CollectionPage({ params }: { params: { address: string, id: string } }) {
  if (process.env.NEXT_PUBLIC_LENSNETWORK_ENVIRONMENT === "main" && process.env.NODE_ENV !== "development") {
    return redirect("/");
  }
 const collection = await getCurrentCollection({ contractAdd: params.address });
 if (!collection) {
  notFound();
 }
 const nfts = await listNFTs({ contractAdd: params.address, start: 0, count: 12 });
 console.log("nfts: ", nfts);
 revalidatePath(`/items/${params.address}`);
 //todo: essa página tá cacheada. tem que ver como faz pra ela atualizar com mais frequência, e especialmente quando vier de redirect.
 //todo: pegar infos de marketplace
 
 return (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-800">
    <CollectionDetails collectionContract={collection} firstNFTs={nfts!} />
  </div>
)
}