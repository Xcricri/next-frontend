import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { typePage } from '@/types/Page'
import Image from 'next/image'
import { useGetPages } from '@/hooks/use-data-page'
import { useDeletePage } from "@/hooks/use-data-page"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"

import { useRouter } from "next/navigation"

export function PageCard() {
    const { data, error, isLoading } = useGetPages();
    const { deletePage } = useDeletePage();

    const router = useRouter()

    const handleDelete = async (pageId: string) => {
        try {
            await deletePage(pageId);
        } catch (error) {
            console.error("Error occurred while deleting page:", error);
        }
    };

    if (isLoading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error occurred while fetching pages.</div>;
    if (!data || data.length === 0) return <div className="text-center py-10">No pages found</div>;

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((page: typePage) => (
                <Card
                    key={page.id}
                    className="group overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                        <Image
                            src={`http://localhost:8000/storage/${page.main_image_url}`}
                            alt="Page cover"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Dropdown */}
                        <div className="absolute right-3 top-3 z-20">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="h-8 w-8 backdrop-blur-sm bg-white/70">
                                        <MoreHorizontalIcon className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => {
                                        const href = `/pages/${page.id}/edit`;
                                        router.push(href);
                                    }}>
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500" onClick={() => {
                                        if (confirm("Are you sure you want to delete this page?")) {
                                            handleDelete(page.id.toString());
                                        }
                                    }}>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Content */}
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-lg font-semibold line-clamp-1">
                            {page.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                            {page.content}
                        </CardDescription>
                    </CardHeader>

                    <CardFooter>
                        <Button className="w-full">
                            View Page
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}