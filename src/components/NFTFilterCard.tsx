"use client"

import { useState } from "react"
import { Sliders, X } from "lucide-react"

type FilterProps = {
  onApplyFilters: (filters: {
    priceRange: number[]
    listingTypes: string[]
  }) => void
}

export default function NFTFilterCard({ onApplyFilters }: FilterProps) {
  const [priceRange, setPriceRange] = useState<number[]>([0,5])

  const [listingTypes, setListingTypes] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(true)

  // Handle price input changes
  const handlePriceChange = (type: "min" | "max", value: string) => {
    // Allow empty string or valid numbers
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = value === "" ? 0 : Number.parseFloat(value)

      if (type === "min") {
        // Ensure min doesn't exceed max
        if (value === "" || numValue <= priceRange[1]) {
          setPriceRange((prev) => ({ ...prev, min: numValue }))
        }
      } else {
        // Ensure max doesn't go below min
        if (value === "" || numValue >= priceRange[0]) {
          setPriceRange((prev) => ({ ...prev, max: numValue }))
        }
      }
    }
  }

  const handleListingTypeToggle = (type: string) => {
    setListingTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const applyFilters = () => {
    onApplyFilters({
      priceRange,
      listingTypes,
    })
  }

  const resetFilters = () => {
    setPriceRange([0,5])
    setListingTypes([])
    onApplyFilters({
      priceRange: [0,5],
      listingTypes: [],
    })
  }

  return (
    <div className="mb-10 relative">
      <div
        className="absolute w-full h-full bg-black rounded-lg"
        style={{
          bottom: "-4px",
          right: "-4px",
        }}
      ></div>

      <div className="relative z-10 border-4 border-black rounded-lg bg-gradient-to-br from-purple-200 to-purple-300 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b-4 border-black bg-gradient-to-r from-purple-400 to-purple-500">
          <h3 className="text-xl font-black text-white flex items-center">
            <Sliders className="mr-2 h-5 w-5" /> FILTER NFTs
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white text-black font-bold p-1 rounded-md border-2 border-black hover:bg-gray-100"
          >
            {isExpanded ? <X className="h-5 w-5" /> : <Sliders className="h-5 w-5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="p-5">
            <div className="mb-6">
              <h4 className="font-black text-lg mb-4">PRICE RANGE (ETH)</h4>

              {/* Number inputs for price range */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block font-bold mb-2">Min Price</label>
                  <input
                    type="text"
                    value={priceRange[0] === 0 ? "" : priceRange[0].toString()}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    placeholder="0"
                    className="w-full p-3 border-4 border-black rounded-md font-bold bg-white text-center"
                  />
                </div>

                <div className="font-black text-lg">TO</div>

                <div className="flex-1">
                  <label className="block font-bold mb-2">Max Price</label>
                  <input
                    type="text"
                    value={priceRange[1] === 5 ? "" : priceRange[1].toString()}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    placeholder="∞"
                    className="w-full p-3 border-4 border-black rounded-md font-bold bg-white text-center"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-black text-lg mb-3">LISTING TYPE</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleListingTypeToggle("buy-now")}
                  className={`py-2 px-4 rounded-md border-2 border-black font-bold ${
                    listingTypes.includes("buy-now") ? "bg-green-500 text-white" : "bg-white text-black"
                  }`}
                >
                  BUY NOW
                </button>
                <button
                  onClick={() => handleListingTypeToggle("auction")}
                  className={`py-2 px-4 rounded-md border-2 border-black font-bold ${
                    listingTypes.includes("auction") ? "bg-blue-500 text-white" : "bg-white text-black"
                  }`}
                >
                  AUCTION
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetFilters}
                className="flex-1 bg-white text-black font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
              >
                RESET
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}





/*'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"

const collections = ["Collection 1", "Collection 2", "Collection 3", "Collection 4", "Collection 5"]
const creators = ["Creator 1", "Creator 2", "Creator 3", "Creator 4", "Creator 5"]

export default function Filters({ onApplyFilters }: { onApplyFilters: any }) {
  const [priceRange, setPriceRange] = useState([0, 10])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [selectedCreators, setSelectedCreators] = useState<string[]>([])
  const [listingType, setListingType] = useState<string | null>(null)

  const handleApplyFilters = () => {
    onApplyFilters({
      priceRange,
      listingType
    })
  }

  const toggleSelection = (list: string[], item: string, setter: (newList: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  return (
    <div className="sticky top-4">
      <Card className="border-4 border-black bg-neutral-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="border-b-4 border-black p-4">
          <CardTitle className="text-xl font-black">Filters</CardTitle>
        </CardHeader>

        <CardContent className="p-5">
           <div className="mb-4">
            <Label className="font-bold text-lg">Listing Type</Label>
            <ToggleGroup
              type="single"
              value={listingType!}
              onValueChange={(value) => setListingType(value)}
              className="flex gap-2 border-2 border-black p-2 rounded-md bg-white"
            >
              <ToggleGroupItem value="auction" className="font-bold border-2 border-black px-4 py-2">
                Auctions
              </ToggleGroupItem>
              <ToggleGroupItem value="buy-now" className="font-bold border-2 border-black px-4 py-2">
                Buy Now
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Accordion type="single" collapsible className="w-full border-b-2 border-black pb-4">
            <AccordionItem value="price">
              <AccordionTrigger className="font-bold text-lg">Price Range</AccordionTrigger>
              <AccordionContent>
                <Slider
                  min={0}
                  max={10}
                  step={0.1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2 border-2 border-black bg-white p-1"
                />
                <div className="flex justify-between text-sm font-bold">
                  <span>{priceRange[0]} GRASS</span>
                  <span>{priceRange[1]} GRASS</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>


          <Accordion type="single" collapsible className="w-full border-b-2 border-black pb-4 mt-4">
            <AccordionItem value="collections">
              <AccordionTrigger className="font-bold text-lg">Collections</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {collections.map((collection) => (
                  <div key={collection} className="flex items-center gap-2 bg-white p-2 rounded-md border-2 border-black">
                    <Checkbox
                      id={collection}
                      checked={selectedCollections.includes(collection)}
                      onCheckedChange={() => toggleSelection(selectedCollections, collection, setSelectedCollections)}
                    />
                    <Label htmlFor={collection} className="font-bold">{collection}</Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="w-full border-b-2 border-black pb-4 mt-4">
            <AccordionItem value="creators">
              <AccordionTrigger className="font-bold text-lg">Creators</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {creators.map((creator) => (
                  <div key={creator} className="flex items-center gap-2 bg-white p-2 rounded-md border-2 border-black">
                    <Checkbox
                      id={creator}
                      checked={selectedCreators.includes(creator)}
                      onCheckedChange={() => toggleSelection(selectedCreators, creator, setSelectedCreators)}
                    />
                    <Label htmlFor={creator} className="font-bold">{creator}</Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            onClick={handleApplyFilters}
            className="w-full bg-blue-700 text-white font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none mt-4"
          >
            ✅ Apply Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}*/

