import { useRouter } from "next/navigation"
import Image from 'next/image'

// Import ui component & icon
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"

// Import type & custom hook Portofolio
import { typePortofolio } from '@/types/Portofolio'
import { useGetPortofolios } from '@/hooks/use-data-portofolio'
import { useDeletePortofolio } from "@/hooks/use-data-portofolio"

// Import helper function
import { getImageUrl } from "../../../function/Image"

export function CardPortofolio() {

    // State dari dari custom hook
    const { data, error, isLoading } = useGetPortofolios();
    const { deletePortofolio } = useDeletePortofolio();

    const router = useRouter()

    // Handle delete function
    const handleDelete = async (portofolioId: string) => {
        try {
            await deletePortofolio(portofolioId);
        } catch (error) {
            console.error("Error occurred while deleting portofolio:", error);
        }
    };

    // Loading, error & not found pages
    if (isLoading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error occurred while fetching portofolios.</div>;
    if (!data || data.length === 0) return <div className="text-center py-10">No portofolios found</div>;

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Mengambil semua data */}
            {data.map((portofolio: typePortofolio) => (
                <Card
                    key={portofolio.id}
                    className="group overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                        <Image
                            src={getImageUrl(portofolio.main_image_url)}
                            alt="Portofolio cover"
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
                                        const href = `/admin/portofolios/edit/${portofolio.id}`;
                                        router.push(href);
                                    }}>
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500" onClick={() => {
                                        if (confirm("Are you sure you want to delete this portofolio?")) {
                                            handleDelete(portofolio.id.toString());
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
                            {portofolio.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                            {portofolio.short_description}
                        </CardDescription>
                    </CardHeader>

                    {/* Footer */}
                    <CardFooter>
                        <Button className="w-full" onClick={() => router.push(`/admin/portofolios/index/${portofolio.slug}`)}>
                            View Portofolio
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}