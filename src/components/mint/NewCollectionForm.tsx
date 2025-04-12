import React, { useState, useRef } from "react"
import Image from "next/image"
import { FileText, ImageIcon, AlertCircle, Film, X, ArrowLeft, ArrowRight } from "lucide-react"
import { createNFTContract } from "../../../lib/nfts"
import { useThirdwebWallet } from "@/hooks/useThirdwebWallet"
import { useActiveAccount } from "thirdweb/react"

type Props = {
  goBack: () => void
}

export function NewCollectionForm({ goBack }: Props) {
   useThirdwebWallet();
     const thirdwebAccount = useActiveAccount();
  const [collectionForm, setCollectionForm] = useState({
    name: "",
    symbol: "",
    description: "",
    type: "unique" as "unique" | "multi-edition",
  })

  const [featuredMedia, setFeaturedMedia] = useState<{
    file: File | null
    url: string | null
    type: "image" | "video" | null
  }>({ file: null, url: null, type: null })

  const [errors, setErrors] = useState<{
    name?: string
    symbol?: string
    description?: string
    featuredMedia?: string
  }>({})

  const mediaInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCollectionForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleTypeChange = (type: "unique" | "multi-edition") => {
    setCollectionForm((prev) => ({ ...prev, type }))
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 20 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, featuredMedia: "File must be less than 20MB" }))
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const mediaType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : null

    if (!mediaType) {
      setErrors((prev) => ({ ...prev, featuredMedia: "File must be an image or video" }))
      return
    }
    setFeaturedMedia({ file, url: objectUrl, type: mediaType })
    setErrors((prev) => ({ ...prev, featuredMedia: undefined }))
  }

  const removeMedia = () => {
    setFeaturedMedia({ file: null, url: null, type: null })
    if (mediaInputRef.current) mediaInputRef.current.value = ""
  }

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!collectionForm.name.trim()) newErrors.name = "Collection name is required"
    if (!collectionForm.symbol.trim()) newErrors.symbol = "Collection symbol is required"
    else if (collectionForm.symbol.length > 10) newErrors.symbol = "Symbol must be 5 characters or less"
    if (!collectionForm.description.trim()) newErrors.description = "Description is required"
    if (!featuredMedia.url) newErrors.featuredMedia = "Featured image or video is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const contractAddress = await createNFTContract(
        thirdwebAccount,
        collectionForm.type,
        collectionForm.name,
        collectionForm.symbol,
        collectionForm.description,
        featuredMedia.file!
      )

      if (contractAddress) {
        alert("Collection created: " + contractAddress)
        goBack()
      } else {
        alert("Failed to create collection")
      }
    } catch (error) {
      console.error("Error creating collection:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={goBack} className="flex items-center font-bold mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to options
      </button>

      <h1 className="text-4xl font-black mb-8">Create New Collection</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left column */}
          <div className="space-y-8">
            {/* Details */}
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
              <div className="relative z-10 bg-gradient-to-br from-white to-[#F7F6FC] rounded-lg border-4 border-black p-6">
                <h2 className="text-xl font-black mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5" /> Collection Details
                </h2>

                <div className="mb-4">
                  <label className="font-bold mb-2 block">Collection Name</label>
                  <input
                    name="name"
                    value={collectionForm.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Mystic Explorers"
                    className="w-full p-3 border-2 border-black rounded-md font-bold bg-white"
                  />
                  {errors.name && <FormError message={errors.name} />}
                </div>

                <div className="mb-4">
                  <label className="font-bold mb-2 block">Collection Symbol</label>
                  <input
                    name="symbol"
                    value={collectionForm.symbol}
                    onChange={handleInputChange}
                    placeholder="e.g. MYSTIC"
                    maxLength={10}
                    className="w-full p-3 border-2 border-black rounded-md font-bold bg-white uppercase"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 10 characters</p>
                  {errors.symbol && <FormError message={errors.symbol} />}
                </div>

                <div>
                  <label className="font-bold mb-2 block">Description</label>
                  <textarea
                    name="description"
                    value={collectionForm.description}
                    onChange={handleInputChange}
                    placeholder="Describe your collection..."
                    rows={4}
                    className="w-full p-3 border-2 border-black rounded-md font-bold bg-white resize-none"
                  />
                  {errors.description && <FormError message={errors.description} />}
                </div>
              </div>
            </div>

            {/* Collection type */}
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
              <div className="relative z-10 bg-gradient-to-br from-[#8EF5F5] to-[#7EF2F2] rounded-lg border-4 border-black p-6">
                <h2 className="text-xl font-black mb-4">Collection Type</h2>

                {["unique", "multi-edition"].map((type) => (
                  <div
                    key={type}
                    className={`p-4 border-2 border-black rounded-md cursor-pointer mb-4 ${
                      collectionForm.type === type ? "bg-[#7EF2F2]" : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => handleTypeChange(type as "unique" | "multi-edition")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 border-black mr-3 flex items-center justify-center ${
                          collectionForm.type === type ? "bg-black" : "bg-white"
                        }`}
                      >
                        {collectionForm.type === type && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <h3 className="font-bold capitalize">{type === "unique" ? "Unique Collection" : "Multi-Edition"}</h3>
                        <p className="text-sm text-gray-600">
                          {type === "unique"
                            ? "Each NFT will be unique with different metadata"
                            : "All NFTs will be identical (like editions of a print)"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Media & Preview */}
          <div className="space-y-8">
            {/* Media */}
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
              <div className="relative z-10 bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2] rounded-lg border-4 border-black p-6">
                <h2 className="text-xl font-black mb-4 flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5" /> Featured Media
                </h2>

                <div className="flex flex-col items-center">
                  <div className="relative mb-4 w-full">
                    <div className="w-full h-64 overflow-hidden relative border-4 border-black bg-white rounded-md">
                      {featuredMedia.url ? (
                        featuredMedia.type === "image" ? (
                          <Image
                            src={featuredMedia.url}
                            alt="Preview"
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <video src={featuredMedia.url} controls className="w-full h-full object-contain" />
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                          <ImageIcon className="h-16 w-16 text-gray-400 mb-2" />
                          <Film className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {featuredMedia.url && (
                      <button
                        onClick={removeMedia}
                        className="absolute top-2 right-2 p-1 rounded-full bg-white border-2 border-black"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    ref={mediaInputRef}
                    className="hidden"
                    id="media-upload"
                  />
                  <label
                    htmlFor="media-upload"
                    className="bg-white text-black font-bold py-2 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 cursor-pointer"
                  >
                    {featuredMedia.url ? "CHANGE MEDIA" : "UPLOAD IMAGE/VIDEO"}
                  </label>

                  {errors.featuredMedia && <FormError message={errors.featuredMedia} />}

                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Supported: JPG, PNG, GIF, SVG, MP4, WEBM. Max size: 20MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Preview & Submit */}
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
              <div className="relative z-10 bg-white rounded-lg border-4 border-black p-6">
                <h2 className="text-xl font-black mb-4">Collection Preview</h2>
                <input type="hidden" name="contractType" value={collectionForm.type} />
                <div className="p-4 border-2 border-black rounded-md bg-gradient-to-br from-[#F7F6FC] to-[#F0EFFA] flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md overflow-hidden relative border-2 border-black flex-shrink-0">
                    {featuredMedia.url && featuredMedia.type === "image" ? (
                      <Image src={featuredMedia.url} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{collectionForm.name || "Collection Name"}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold bg-[#D7D3F5] px-2 py-0.5 rounded border border-black">
                        {collectionForm.symbol || "SYMBOL"}
                      </span>
                      <span className="text-sm text-gray-600">
                        {collectionForm.type === "unique" ? "Unique NFTs" : "Multi-Edition NFTs"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center"
            >
              CREATE COLLECTION <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function FormError({ message }: { message: string }) {
  return (
    <div className="mt-1 flex items-center text-red-500 text-sm">
      <AlertCircle className="h-4 w-4 mr-1" />
      {message}
    </div>
  )
}
