"use client"

import { useParams } from "next/navigation"
import IndexPage from "@/components/pages/IndexPage"

export default function SlugPage() {
    const { slug } = useParams<{ slug: string }>()

    return <IndexPage pageId={slug} />
}
