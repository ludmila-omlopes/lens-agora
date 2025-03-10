import { Card, CardContent } from "@/components/ui/card";

export const NFTTransactionHistory = ({ history }: { history: any[] }) => {
  return (
    <Card className="bg-white bg-opacity-80 dark:bg-white dark:bg-opacity-10 text-gray-800 dark:text-white">
      <CardContent className="p-4">
        <ul>
          {history.map((item, index) => (
            <li key={index} className="mb-2 pb-2 border-b border-gray-600 last:border-b-0">
              <p className="font-semibold">{item.event}</p>
              <p className="text-sm">From: {item.from} {item.to && `To: ${item.to}`}</p>
              <p className="text-sm">Price: {item.price}</p>
              <p className="text-sm text-gray-500">{item.date}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
