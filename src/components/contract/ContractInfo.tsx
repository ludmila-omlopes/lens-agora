import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collection } from "../../../lib/types"

export default function ContractInfo( { contract }: { contract: Collection }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Contract Address:</strong> {contract.address}</p>
        <p><strong>Type:</strong> {contract.type}</p>
       { /*<p><strong>Total Supply:</strong> {contract.totalSupply}</p> */}
        {/* <p><strong>Minted:</strong> {contract.minted} ({(contract.minted / contract.totalSupply * 100).toFixed(2)}%)</p>*/} 
        <p><strong>Owner:</strong> {contract.owner}</p>
       {/* <p><strong>Created At:</strong> {new Date(contract.).toLocaleDateString()}</p> */}
       {/* <p><strong>Royalties:</strong> {contract.}</p> */}
      </CardContent>
    </Card>
  )
}

