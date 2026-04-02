"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
    value: string[]
    onChange: (value: string[]) => void
    onRemove: (value: string) => void
    disabled?: boolean
    bucket?: string
    multiple?: boolean
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    disabled,
    bucket = "model-images",
    multiple = false
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        const newUrls: string[] = []

        try {
            for (const file of Array.from(files)) {
                console.error("[upload fix] Starting upload for file:", file.name)

                // Upload via server API (bypasses RLS using service role key)
                const formData = new FormData()
                formData.append('file', file)
                formData.append('bucket', bucket)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    console.error("[upload fix] Upload error:", errorData)
                    throw new Error(errorData.error || 'Upload failed')
                }

                const { url } = await response.json()
                console.error("[upload fix] Upload successful, URL:", url)
                newUrls.push(url)
            }

            onChange(multiple ? [...value, ...newUrls] : newUrls)
            toast.success("Image uploaded successfully")
        } catch (error: any) {
            console.error("[upload fix] Upload failed:", error.message || error)
            toast.error("Error uploading image", {
                description: error.message
            })
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {value.map((url) => (
                    <div key={url} className="relative h-[200px] w-[200px] overflow-hidden rounded-md border">
                        <div className="absolute right-2 top-2 z-10">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    className="hidden"
                    ref={fileInputRef}
                    onChange={onUpload}
                    disabled={disabled || isUploading}
                />
                <Button
                    type="button"
                    disabled={disabled || isUploading}
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ImagePlus className="mr-2 h-4 w-4" />
                    )}
                    Upload Image
                </Button>
            </div>
        </div>
    )
}
