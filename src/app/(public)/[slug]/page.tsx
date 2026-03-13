"use client"

// Other import
import { useParams } from "next/navigation"
import IndexPage from "@/components/Pages/IndexPages"

export default function SlugPage() {
    // Ambil slug dari parameter
    const { slug } = useParams<{ slug: string }>()

    return <IndexPage pageId={slug} />
}
