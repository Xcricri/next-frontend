'use client'

// Other import 
import { CardPortofolio } from "@/components/portofolios/CardPortofolios"
import Link from "next/link"

const Page = () => {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Create Portofolio Button */}
                <div className='flex mb-2 items-center justify-end'>
                    <Link href="/admin/portofolios/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create Portofolio
                    </Link>
                </div>

                {/* Portofolio List */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <CardPortofolio />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page