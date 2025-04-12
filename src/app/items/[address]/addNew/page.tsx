"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ImageIcon, Film, X, Plus, AlertCircle, ArrowRight, ArrowLeft, Tag, FileText, Layers } from "lucide-react"
import { getCurrentCollection, mintNewNFT } from "../../../../../lib/nfts"
import { Collection } from "../../../../../lib/types"
import { toast } from "@/hooks/use-toast"
import { useThirdwebWallet } from "@/hooks/useThirdwebWallet"
import { useActiveAccount } from "thirdweb/react"

type Attribute = {
  id: string
  name: string
  value: string
}

export default function MintNFTPage({ params }: { params: { address: string } }) {
  const [collectionInfo, setCollectionInfo] = useState<Collection>();
  const [isMinting, setIsMinting] = useState(false);
    useThirdwebWallet();
    const account = useActiveAccount();

  useEffect(() => {
    const fetchCollection = async () => {
      if (params.address) {
        const fetchedCollectionInfo = await getCurrentCollection({ contractAdd: params.address });
        setCollectionInfo(fetchedCollectionInfo);
      }
    };
    fetchCollection();
  }, [params.address]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    initialSupply: collectionInfo?.is1155 ? "1" : undefined,
  });

  // Media state
  const [media, setMedia] = useState<
    Array<{
      id: string
      url: string
      type: "image" | "video"
      file: File
    }>
  >([])

  const mediaInputRef = useRef<HTMLInputElement>(null)

  const [attributes, setAttributes] = useState<Attribute[]>([])

  const [errors, setErrors] = useState<{
    name?: string
    description?: string
    media?: string
    initialSupply?: string
    attributes?: string
  }>({})


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))


    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return


    Array.from(files).forEach((file) => {

      if (file.size > 20 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, media: "File must be less than 20MB" }))
        return
      }

      let mediaType: "image" | "video" | null = null

      if (file.type.startsWith("image/")) {
        mediaType = "image"
      } else if (file.type.startsWith("video/")) {
        mediaType = "video"
      } else {
        setErrors((prev) => ({ ...prev, media: "File must be an image or video" }))
        return
      }

      const objectUrl = URL.createObjectURL(file)
      setMedia((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 11),
          url: objectUrl,
          type: mediaType,
          file
        },
      ])
      setErrors((prev) => ({ ...prev, media: undefined }))
    })

    // Reset the input
    if (mediaInputRef.current) {
      mediaInputRef.current.value = ""
    }
  }

  // Remove media
  const removeMedia = (id: string) => {
    setMedia((prev) => prev.filter((item) => item.id !== id))
  }

  // Add attribute
  const addAttribute = () => {
    const newAttribute = {
      id: Math.random().toString(36).substring(2, 11),
      name: "",
      value: "",
    }
    setAttributes((prev) => [...prev, newAttribute])
  }

  // Remove attribute
  const removeAttribute = (id: string) => {
    setAttributes((prev) => prev.filter((attr) => attr.id !== id))
  }

  // Update attribute
  const updateAttribute = (id: string, field: "name" | "value", value: string) => {
    setAttributes((prev) => prev.map((attr) => (attr.id === id ? { ...attr, [field]: value } : attr)))
  }

  // Validate form
  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (media.length === 0) {
      newErrors.media = "At least one image or video is required"
    }

    if (collectionInfo?.is1155) {
      const supply = Number.parseInt(formData.initialSupply || "0", 10)
      if (isNaN(supply) || supply < 1) {
        newErrors.initialSupply = "Initial supply must be at least 1"
      } else if (supply > 10000) {
        newErrors.initialSupply = "Initial supply cannot exceed 10,000"
      }
    }

    // Check for empty attribute fields
    const hasEmptyAttributes = attributes.some((attr) => !attr.name.trim() || !attr.value.trim())
    if (hasEmptyAttributes) {
      newErrors.attributes = "All attribute fields must be filled or removed"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!account || !account.address) {
      toast({
        title: "Error",
        description: "You must be connected to your wallet to mint an NFT.",
        variant: "destructive",
      });
      return;
    }
  
    const isValid = validateForm();
    if (!isValid) return;
  
    setIsMinting(true); // 🔄 Start loading
  
    try {
      const response = await mintNewNFT({
        contractAdd: params.address,
        name: formData.name,
        quantity: BigInt(formData.initialSupply || "1"),
        description: formData.description,
        mintToAdd: account.address,
        account: account,
        media: media[0].file,
      });
  
      toast({
        title: "Success",
        description: "NFT minted successfully!",
      });
  
      window.location.href = `/items/${params.address}/${collectionInfo?.totalItems!}`;
      console.log("NFT mint response:", response);
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Error",
        description: "Something went wrong during minting.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };
  

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      media.forEach((item) => URL.revokeObjectURL(item.url))
    }
  }, [])

  return (
    <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-[#F7F6FC] to-[#F0EFFA]">
      <div className="max-w-4xl mx-auto">
        <Link href="/create" className="flex items-center font-bold mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-md overflow-hidden relative border-2 border-black">
            <img
              src={collectionInfo?.imageUrl || "/placeholder.png"}
              alt={collectionInfo?.name}          
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl font-black">Mint New NFT</h1>
            <p className="text-gray-600"><span>to </span>
              <a href={"/items/" + params.address} target="_blank" rel="noopener noreferrer" className="font-bold underline">
                 {collectionInfo?.name}
              </a>
              {collectionInfo?.is1155 && <span className="ml-1">(Multi-Edition)</span>}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Left column - NFT Details */}
            <div className="space-y-8">
              {/* Basic Details */}
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
                <div className="relative z-10 bg-gradient-to-br from-white to-[#F7F6FC] rounded-lg border-4 border-black p-6">
                  <h2 className="text-xl font-black mb-4 flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> NFT Details
                  </h2>

                  {/* NFT Name */}
                  <div className="mb-4">
                    <label htmlFor="name" className="block font-bold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Cosmic Voyage #42"
                      className="w-full p-3 border-2 border-black rounded-md font-bold bg-white"
                    />
                    {errors.name && (
                      <div className="mt-1 flex items-center text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  {/* NFT Description */}
                  <div className="mb-4">
                    <label htmlFor="description" className="block font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your NFT..."
                      rows={4}
                      className="w-full p-3 border-2 border-black rounded-md font-bold bg-white resize-none"
                    />
                    {errors.description && (
                      <div className="mt-1 flex items-center text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.description}
                      </div>
                    )}
                  </div>

                  {/* Initial Supply (only for multi-edition) */}
                  {collectionInfo?.is1155 && (
                    <div>
                      <label htmlFor="initialSupply" className="block font-bold mb-2">
                        Initial Supply
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          id="initialSupply"
                          name="initialSupply"
                          value={formData.initialSupply}
                          onChange={handleInputChange}
                          min="1"
                          max="10000"
                          placeholder="1"
                          className="w-full p-3 border-2 border-black rounded-md font-bold bg-white"
                        />
                        <div className="ml-2 bg-[#D7D3F5] p-3 border-2 border-black rounded-md">
                          <Layers className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Number of editions to mint initially (max 10,000)</p>
                      {errors.initialSupply && (
                        <div className="mt-1 flex items-center text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.initialSupply}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Attributes */}
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
                <div className="relative z-10 bg-gradient-to-br from-[#F7B5DE] to-[#F29BD4] rounded-lg border-4 border-black p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-black flex items-center">
                      <Tag className="mr-2 h-5 w-5" /> Attributes
                    </h2>
                    <button
                      type="button"
                      onClick={addAttribute}
                      className="bg-white text-black font-bold py-1 px-3 rounded-md border-2 border-black flex items-center transition-colors hover:bg-[#F29BD4] hover:text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </button>
                  </div>

                  {attributes.length === 0 ? (
                    <div className="p-4 border-2 border-black rounded-md bg-white text-center">
                      <p className="text-gray-500">No attributes yet. Click "Add" to create properties for your NFT.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attributes.map((attr) => (
                        <div key={attr.id} className="p-3 border-2 border-black rounded-md bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold">Attribute</h3>
                            <button
                              type="button"
                              onClick={() => removeAttribute(attr.id)}
                              className="p-1 rounded-full bg-white border-2 border-black hover:bg-gray-100"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-bold mb-1 text-gray-500">Name</label>
                              <input
                                type="text"
                                value={attr.name}
                                onChange={(e) => updateAttribute(attr.id, "name", e.target.value)}
                                placeholder="e.g. Color"
                                className="w-full p-2 border-2 border-black rounded-md bg-white text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold mb-1 text-gray-500">Value</label>
                              <input
                                type="text"
                                value={attr.value}
                                onChange={(e) => updateAttribute(attr.id, "value", e.target.value)}
                                placeholder="e.g. Blue"
                                className="w-full p-2 border-2 border-black rounded-md bg-white text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.attributes && (
                    <div className="mt-2 flex items-center text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.attributes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column - Media Upload and Preview */}
            <div className="space-y-8">
              {/* Media Upload */}
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
                <div className="relative z-10 bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2] rounded-lg border-4 border-black p-6">
                  <h2 className="text-xl font-black mb-4 flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5" /> Media
                  </h2>

                  <div className="flex flex-col items-center">
                    <div className="w-full mb-4">
                      {media.length === 0 ? (
                        <div className="w-full h-64 overflow-hidden relative border-4 border-black bg-white rounded-md flex flex-col items-center justify-center">
                          <ImageIcon className="h-16 w-16 text-gray-400 mb-2" />
                          <Film className="h-16 w-16 text-gray-400" />
                          <p className="mt-4 text-gray-500 font-bold">No media uploaded yet</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {media.map((item) => (
                            <div
                              key={item.id}
                              className="relative border-4 border-black bg-white rounded-md overflow-hidden aspect-square"
                            >
                              {item.type === "image" ? (
                                <img
                                  src={item.url || "/placeholder.svg"}
                                  alt="Media preview"
                                  className="object-cover"
                                />
                              ) : (
                                <video src={item.url} controls className="w-full h-full object-cover" />
                              )}
                              <button
                                type="button"
                                onClick={() => removeMedia(item.id)}
                                className="absolute top-2 right-2 p-1 rounded-full bg-white border-2 border-black hover:bg-gray-100"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          {media.length < 5 && (
                            <label
                              htmlFor="media-upload"
                              className="border-4 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center aspect-square cursor-pointer hover:border-gray-400 bg-white"
                            >
                              <Plus className="h-8 w-8 text-gray-400" />
                              <span className="mt-2 text-sm text-gray-500">Add more</span>
                            </label>
                          )}
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      ref={mediaInputRef}
                      className="hidden"
                      id="media-upload"
                      multiple={media.length < 5}
                    />
                    <label
                      htmlFor="media-upload"
                      className="bg-white text-black font-bold py-2 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 active:shadow-none cursor-pointer"
                    >
                      {media.length === 0 ? "UPLOAD IMAGE/VIDEO" : "ADD MORE MEDIA"}
                    </label>

                    {errors.media && (
                      <div className="mt-2 flex items-center text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.media}
                      </div>
                    )}

                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Upload up to 5 images or videos for your NFT.
                      <br />
                      Supported formats: JPG, PNG, GIF, SVG, MP4, WEBM
                      <br />
                      Max size: 20MB per file
                    </p>
                  </div>
                </div>
              </div>

              {/* NFT Preview */}
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
                <div className="relative z-10 bg-gradient-to-br from-[#8EF5F5] to-[#7EF2F2] rounded-lg border-4 border-black p-6">
                  <h2 className="text-xl font-black mb-4">NFT Preview</h2>

                  <div className="bg-white rounded-lg border-4 border-black overflow-hidden">
                    <div className="relative aspect-square">
                      {media.length > 0 ? (
                        media[0].type === "image" ? (
                          <img
                            src={media[0].url || "/placeholder.svg"}
                            alt="NFT preview"
                            className="object-cover"
                          />
                        ) : (
                          <video src={media[0].url} controls className="w-full h-full object-cover" />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ImageIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      {media.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs font-bold">
                          +{media.length - 1} more
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-xl font-black mb-1">{formData.name || "Untitled NFT"}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {collectionInfo?.name}{" "}
                        {collectionInfo?.is1155 && `(${formData.initialSupply || 1} editions)`}
                      </p>

                      {attributes.length > 0 && (
                        <div className="mt-3">
                          <h4 className="font-bold text-sm mb-2">Attributes:</h4>
                          <div className="flex flex-wrap gap-2">
                            {attributes.map(
                              (attr) =>
                                attr.name &&
                                attr.value && (
                                  <div
                                    key={attr.id}
                                    className="bg-[#F7F6FC] px-2 py-1 rounded-md border border-black text-xs font-bold"
                                  >
                                    <span className="text-gray-500">{attr.name}:</span> {attr.value}
                                  </div>
                                ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
  type="submit"
  disabled={isMinting}
  className="w-full bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isMinting ? (
    <>
      Minting NFT...
      <svg
        className="animate-spin ml-2 h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
    </>
  ) : (
    <>
      MINT NFT <ArrowRight className="ml-2 h-5 w-5" />
    </>
  )}
</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
