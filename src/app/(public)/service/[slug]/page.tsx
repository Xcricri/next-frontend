"use client"

// Other import
import { useParams } from "next/navigation"
import IndexService from "@/components/Service/IndexService"

export default function SlugPage() {
    // Mengambil slug dari parameter
    const { slug } = useParams<{ slug: string }>()

    return <IndexService ServiceId={slug} />
}
