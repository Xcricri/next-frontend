import React from "react"
import { useGetPageBySlug } from "@/hooks/use-data-page"
import Image from "next/image"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { getImageUrl } from "../../../function/Image"

const IndexPages = ({ pageId }: { pageId?: string }) => {
    const { data, isLoading } = useGetPageBySlug(pageId || "")

    if (isLoading)
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-muted-foreground">Loading page...</p>
            </div>
        )

    if (!data)
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-destructive font-medium">Page not found</p>
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

export default IndexPages