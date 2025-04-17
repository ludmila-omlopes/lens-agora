  "use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Wallet, User, Check, AlertCircle, ArrowRight, X, Globe, ImageIcon } from "lucide-react"
import { useAccount } from "wagmi"
import { ConnectKitButton } from "connectkit"
import { useLensSession } from "@/contexts/LensSessionContext"
import { useThirdwebWallet } from "@/hooks/useThirdwebWallet"
import { useActiveAccount } from "thirdweb/react"
import { uploadMediaToGrove, uploadMetadataToGrove } from "../../../lib/lensNetwork"
import { MetadataAttributeType, account as accountMetadata } from "@lens-protocol/metadata";
import { createAccountWithUsername } from "@lens-protocol/client/actions"
import { uri } from "@lens-protocol/client"

export default function CreateAccountPage() {
  const appAddress = "0xC75A89145d765c396fd75CbD16380Eb184Bd2ca7" // testnet
  const { loginAsOnboardingUser, sessionClient } = useLensSession();
  useThirdwebWallet();
  const account = useActiveAccount();

  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    bio: "",
    website: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { address, isConnected: isWalletConnected } = useAccount();

  const [errors, setErrors] = useState<{
    username?: string
    displayName?: string
    bio?: string
    avatar?: string
    coverImage?: string
    wallet?: string
    website?: string
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 7 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "Image must be less than 7MB" }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, avatar: "File must be an image" }));
      return;
    }
    setAvatar(file);
    setErrors((prev) => ({ ...prev, avatar: undefined }));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 7 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, coverImage: "Image must be less than 7MB" }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, coverImage: "File must be an image" }));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setCoverImage(objectUrl);
    setErrors((prev) => ({ ...prev, coverImage: undefined }));
    return () => URL.revokeObjectURL(objectUrl);
  };

  const removeAvatar = () => {
    setAvatar(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const removeCover = () => {
    setCoverImage(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!isWalletConnected) newErrors.wallet = "Please connect your wallet";
    if (!avatar) newErrors.avatar = "Please upload an avatar";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters";
    if (!formData.displayName.trim()) newErrors.displayName = "Display name is required";
    if (formData.bio.length > 500) newErrors.bio = "Bio must be less than 500 characters";
    if (formData.website && !isValidUrl(formData.website)) newErrors.website = "Please enter a valid URL (include http:// or https://)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !isWalletConnected) return;
    if (!validateForm()) return;

    try {
      await loginAsOnboardingUser({ appAddress, walletAddress: address });
      console.log("Logged in as onboarding user", { appAddress, walletAddress: address });
      const avataURI = await uploadMediaToGrove(avatar!);
      var coverURI;
      if (coverInputRef.current?.files?.[0]) {
        coverURI = await uploadMediaToGrove(coverInputRef.current.files[0]);
      }

      const metadata = accountMetadata({
        name: formData.displayName,
        bio: formData.bio,
        picture: avataURI.uri,
        coverPicture: coverURI?.uri,
        //todo: colocar atributos
      });

      const metadataURI = await uploadMetadataToGrove(metadata);

      const result = await createAccountWithUsername(sessionClient!, {
        username: { localName: formData.username },
        metadataUri: uri(metadataURI.uri),
      });

      console.log("Account created successfully", result);

    } catch (error) {
      console.error("Failed to create Account", error);
      setErrors((prev) => ({ ...prev, wallet: "Failed to authenticate with Lens" }));
    }
  };

  const formatWebsiteUrl = (url: string) => {
    if (!url) return "";
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  };
  
  return (
    <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-[#F7F6FC] to-[#F0EFFA]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8 text-center">Create Your Account</h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left column - Form */}
          <div className="space-y-8">
            {/* Wallet Connection */}
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
              <div className="relative z-10 bg-gradient-to-br from-[#D7D3F5] to-[#CFC9F2] rounded-lg border-4 border-black p-6">
                <h2 className="text-xl font-black mb-4 flex items-center">
                  <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
                </h2>

                {<ConnectKitButton />}

                {errors.wallet && (
                  <div className="mt-2 flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.wallet}
                  </div>
                )}
              </div>
            </div>

            {/* Avatar Upload */}
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
              <div className="relative z-10 bg-gradient-to-br from-[#F7B5DE] to-[#F29BD4] rounded-lg border-4 border-black p-6">
                <h2 className="text-xl font-black mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5" /> Upload Avatar
                </h2>

                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="h-32 w-32 rounded-full overflow-hidden relative border-4 border-black bg-white">
                      {avatar ? (
                        <img src={avatar ? URL.createObjectURL(avatar) : "/placeholder.svg"} alt="Avatar preview" className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100">
                          <User className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {avatar && (
                      <button
                        onClick={removeAvatar}
                        className="absolute top-0 right-0 p-1 rounded-full bg-white border-2 border-black"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    ref={avatarInputRef}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="bg-white text-black font-bold py-2 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none cursor-pointer"
                  >
                    {avatar ? "CHANGE AVATAR" : "CHOOSE AVATAR"}
                  </label>

                  {errors.avatar && (
                    <div className="mt-2 flex items-center text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.avatar}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
              <div className="relative z-10 bg-gradient-to-br from-[#8EF5F5] to-[#7EF2F2] rounded-lg border-4 border-black p-6">
                <h2 className="text-xl font-black mb-4 flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5" /> Cover Image
                </h2>

                <div className="flex flex-col items-center">
                  <div className="relative mb-4 w-full">
                    <div className="w-full h-40 overflow-hidden relative border-4 border-black bg-white rounded-md">
                      {coverImage ? (
                        <img
                          src={coverImage || "/placeholder.svg"}
                          alt="Cover image preview"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100">
                          <ImageIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {coverImage && (
                      <button
                        onClick={removeCover}
                        className="absolute top-2 right-2 p-1 rounded-full bg-white border-2 border-black"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    ref={coverInputRef}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="bg-white text-black font-bold py-2 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none cursor-pointer"
                  >
                    {coverImage ? "CHANGE COVER" : "CHOOSE COVER"}
                  </label>

                  {errors.coverImage && (
                    <div className="mt-2 flex items-center text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.coverImage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Profile Info */}
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
            <div className="relative z-10 bg-gradient-to-br from-white to-[#E0FAFA] rounded-lg border-4 border-black p-6">
              <h2 className="text-xl font-black mb-4 flex items-center">
                <User className="mr-2 h-5 w-5" /> Profile Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block font-bold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter a unique username"
                    className="w-full p-3 border-2 border-black rounded-md font-bold bg-white"
                  />
                  {errors.username && (
                    <div className="mt-1 flex items-center text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.username}
                    </div>
                  )}
                </div>

                {/* Display Name */}
                <div>
                  <label htmlFor="displayName" className="block font-bold mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="Enter your display name"
                    className="w-full p-3 border-2 border-black rounded-md font-bold bg-white"
                  />
                  {errors.displayName && (
                    <div className="mt-1 flex items-center text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.displayName}
                    </div>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block font-bold mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                      className="w-full p-3 pl-10 border-2 border-black rounded-md font-bold bg-white"
                    />
                  </div>
                  {errors.website && (
                    <div className="mt-1 flex items-center text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.website}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block font-bold mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full p-3 border-2 border-black rounded-md font-bold bg-white resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    <div className={formData.bio.length > 500 ? "text-red-500 text-sm" : "text-gray-500 text-sm"}>
                      {formData.bio.length}/500 characters
                    </div>
                    {errors.bio && (
                      <div className="flex items-center text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.bio}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-[#8F83E0] to-[#7F71D9] text-white font-black py-3 px-4 rounded-md border-2 border-black transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none flex items-center justify-center"
                >
                  CREATE ACCOUNT <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-16 relative">
          <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-lg"></div>
          <div className="relative z-10 bg-white rounded-lg border-4 border-black p-6">
            <h2 className="text-xl font-black mb-6">Profile Preview</h2>

            <div className="bg-gradient-to-br from-[#F7F6FC] to-[#F0EFFA] rounded-md border-2 border-black overflow-hidden">
              {/* Cover Image */}
              <div className="relative h-48 w-full">
                {coverImage ? (
                  <Image src={coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-[#D7D3F5] to-[#CFC9F2] flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-white opacity-30" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="p-6 relative">
                {/* Avatar - positioned to overlap the cover image */}
                <div className="absolute -top-16 left-6 h-24 w-24 rounded-full overflow-hidden border-4 border-black bg-white">
                  {avatar ? (
                    <Image src={avatar ? URL.createObjectURL(avatar) : "/placeholder.svg"} alt="Avatar preview" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Profile content - with margin to account for the avatar */}
                <div className="mt-10">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black">{formData.displayName || "Your Display Name"}</h3>

                    {isWalletConnected && (
                      <div className="inline-flex items-center bg-[#D7D3F5] px-3 py-1 rounded-md border-2 border-black text-sm font-bold">
                        <Wallet className="h-4 w-4 mr-1" />
                        {address}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mb-3">@{formData.username || "username"}</p>

                  {formData.website && (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#7F71D9] font-bold mb-4 hover:underline"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      {formatWebsiteUrl(formData.website)}
                    </a>
                  )}

                  <p className="text-sm max-w-2xl mt-4">
                    {formData.bio || "Your bio will appear here. Tell collectors about yourself and your artwork."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Already have an account */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#7F71D9] hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

