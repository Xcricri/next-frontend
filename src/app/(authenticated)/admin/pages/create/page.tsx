"use client"

import React from 'react'

// Import Component
import CreatePageForm from '@/components/Pages/CreatePageForm'

const Page = () => {
    return (
        <>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg text-gray-500">
                        <CreatePageForm />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page