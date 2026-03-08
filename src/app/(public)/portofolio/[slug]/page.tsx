"use client"

// Other import
import { useParams } from "next/navigation"
import IndexPortofolios from "@/components/portofolios/IndexPortofolios"

export default function SlugPage() {
    // Mengambil slug dari parameter
    const { slug } = useParams<{ slug: string }>()

    return <IndexPortofolios pageId={slug} />
}
