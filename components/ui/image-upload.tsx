"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
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
        const supabase = createClient()
        const newUrls: string[] = []

        try {
            for (const file of Array.from(files)) {
                // Validate file is actually an image
                if (!file.type.startsWith('image/')) {
                    throw new Error(`Invalid file type: ${file.type}. Only images are allowed.`)
                }

                const fileExt = file.name.split(".").pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
                const filePath = `${fileName}`

                console.log('[v0 upload] Uploading to bucket:', bucket, 'file:', fileName)

                const { data, error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    })

                if (uploadError) {
                    console.error('[v0 upload] Upload failed:', uploadError)
                    throw uploadError
                }

                console.log('[v0 upload] Upload successful:', data)

                // Get public URL
                const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath)
                const publicUrl = publicUrlData.publicUrl

                console.log('[v0 upload] Public URL generated:', publicUrl)
                newUrls.push(publicUrl)
            }

            // Update state with new URLs - this triggers immediate preview
            const updatedUrls = multiple ? [...value, ...newUrls] : newUrls
            onChange(updatedUrls)
            toast.success(`Image${newUrls.length > 1 ? 's' : ''} uploaded successfully`)
        } catch (error: any) {
            console.error('[v0 upload]', error)
            toast.error("Error uploading image", {
                description: error?.message || "Unknown error occurred"
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
