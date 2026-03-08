"use client"

import React from 'react'
import IndexPortofolios from '@/components/portofolios/IndexPortofolios'
import { useParams } from 'next/navigation'

const Page = () => {
    const params = useParams()
    const pageId = params.id as string

    return (
        <>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg text-gray-500">
                        <IndexPortofolios pageId={pageId} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page