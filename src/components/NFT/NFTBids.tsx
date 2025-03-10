import { Card, CardContent } from "@/components/ui/card";

export const NFTBids = ({ bids }: { bids: any[] }) => {
  return (
    <Card className="bg-white bg-opacity-80 dark:bg-white dark:bg-opacity-10 text-gray-800 dark:text-white">
      <CardContent className="p-4">
        {bids.length > 0 ? (
          <ul>
            {bids.map((bid, index) => (
              <li key={index} className="mb-2 pb-2 border-b border-gray-600 last:border-b-0">
                <p className="font-semibold">Bid Placed</p>
                <p className="text-sm">By: {bid.bidder}</p>
                <p className="text-sm">Amount: {bid.amount} ETH</p>
                <p className="text-sm text-gray-500">{bid.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No bids yet. Be the first to place a bid!</p>
        )}
      </CardContent>
    </Card>
  );
};
