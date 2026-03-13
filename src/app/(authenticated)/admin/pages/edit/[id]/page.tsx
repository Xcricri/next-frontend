"use client"

// Other import
import React from 'react'
import UpdatePageForm from '@/components/Pages/UpdatePage'
import { useParams } from 'next/navigation'

const Page = () => {
    // Ambil id dari parameter
    const params = useParams()
    const pageId = params.id as string

    return (
        <>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg text-gray-500">
                        <UpdatePageForm pageId={pageId} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page