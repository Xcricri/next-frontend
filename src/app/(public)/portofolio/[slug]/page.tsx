"use client"

import { useParams } from "next/navigation"
import IndexPortofolios from "@/components/portofolios/IndexPortofolios"

export default function SlugPage() {
    const { slug } = useParams<{ slug: string }>()

    return <IndexPortofolios pageId={slug} />
}
