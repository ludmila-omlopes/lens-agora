'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const collections = ['Collection 1', 'Collection 2', 'Collection 3', 'Collection 4', 'Collection 5']
const creators = ['Creator 1', 'Creator 2', 'Creator 3', 'Creator 4', 'Creator 5', 'Creator 6', 'Creator 7', 'Creator 8', 'Creator 9', 'Creator 10']

export default function Filters({ onApplyFilters } : {onApplyFilters : any}) {
  const [priceRange, setPriceRange] = useState([0, 10])
  const [selectedCollections, setSelectedCollections] = useState([])
  const [selectedCreators, setSelectedCreators] = useState([])

  const handleApplyFilters = () => {
    onApplyFilters({
      priceRange,
      collections: selectedCollections,
      creators: selectedCreators,
    })
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <Slider
                min={0}
                max={10}
                step={0.1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-2"
              />
              <div className="flex justify-between text-sm">
                <span>{priceRange[0]} GRASS</span>
                <span>{priceRange[1]} GRASS</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button onClick={handleApplyFilters} className="w-full mt-4">Apply Filters</Button>
      </CardContent>
    </Card>
  )
}

