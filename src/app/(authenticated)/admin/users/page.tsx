"use client";

// Other import
import React from 'react'
import { TableUser } from '@/components/Users/TableUser';
import Link from 'next/dist/client/link';

const Page = () => {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Create User Button */}
                <div className='flex mb-2 items-center justify-end'>
                    <Link href="/admin/users/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create User
                    </Link>
                </div>

                {/* User List */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg text-black">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <TableUser />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page