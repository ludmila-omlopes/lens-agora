"use client"

import type React from "react"
import { useState } from "react"
import { MintOptions } from "@/components/mint/MintOptions"
import { NewCollectionForm } from "@/components/mint/NewCollectionForm"
import { ExistingCollections } from "@/components/mint/ExistingCollections"

export default function MintNFTPage() {
  const [view, setView] = useState<"options" | "new-collection" | "existing-collection">("options")

  const renderView = () => {
    switch (view) {
      case "new-collection":
        return <NewCollectionForm goBack={() => setView("options")} />
      case "existing-collection":
        return <ExistingCollections goBack={() => setView("options")} />
      default:
        return <MintOptions setView={setView} />
    }
  }

  return <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-[#F7F6FC] to-[#F0EFFA]">{renderView()}</div>
}
