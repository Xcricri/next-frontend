'use client'

// Other import 
import { CardPage } from "@/components/Pages/CardPage"
import Link from "next/link"

const Page = () => {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Create Page Button */}
                <div className='flex mb-2 items-center justify-end'>
                    <Link href="/admin/pages/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create Page
                    </Link>
                </div>

                {/* Page List */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <CardPage />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page