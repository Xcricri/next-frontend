import React from "react"
import { useGetPortofolioBySlug } from "@/hooks/use-data-portofolio"
import Image from "next/image"

// Import Ui component
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Import type
import { typePortoImage } from "@/types/PortofolioImage"

// Import function
import { getImageUrl } from "../../../function/Image"

const IndexPortofolios = ({ pageId }: { pageId?: string }) => {
    // State dari custom hool
    const { data, isLoading } = useGetPortofolioBySlug(pageId || "")

    // Loading & not found pages
    if (isLoading)
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-muted-foreground">Loading portofolio...</p>
            </div>
        )

    if (!data)
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-destructive font-medium">Portofolio not found</p>
            </div>
        )

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <Card>

                {/* Header */}
                <CardHeader className="space-y-3">
                    <CardTitle className="text-3xl font-bold">
                        {data.title}
                    </CardTitle>

                    <CardDescription>
                        Page slug
                    </CardDescription>

                    <Badge variant="secondary" className="w-fit">
                        /{data.slug}
                    </Badge>
                </CardHeader>

                <Separator />

                {/* Image */}
                {data.main_image_url && (
                    <div className="px-6 pt-6">
                        <Image
                            src={getImageUrl(data.main_image_url)}
                            alt={data.title}
                            width={800}
                            height={400}
                            className="rounded-lg w-full object-cover"
                            unoptimized
                        />
                    </div>
                )}


                {/* Gallery */}
                {data.images && data.images.length > 0 && (
                    <div className="px-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.images.map((img: typePortoImage, index: number) => (
                                <Image
                                    key={img.id}
                                    src={getImageUrl(img.image_url)}
                                    alt={img.caption || `${data.title} ${index + 1}`}
                                    width={400}
                                    height={300}
                                    className="rounded-lg w-full object-cover"
                                    unoptimized
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <CardContent className="pt-6">
                    <div className="prose max-w-none text-muted-foreground leading-relaxed">
                        {data.content}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default IndexPortofolios