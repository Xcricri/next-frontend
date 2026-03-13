'use client'

// Other import 
import { CardService } from "@/components/Service/CardService"
import Link from "next/link"

const Page = () => {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Create Service Button */}
                <div className='flex mb-2 items-center justify-end'>
                    <Link href="/admin/services/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create Service
                    </Link>
                </div>

                {/* Service List */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <CardService />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page