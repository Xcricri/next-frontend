import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import NavLink from '@/components/NavLink'
import Dropdown from '@/components/Dropdown'
import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink'
import { DropdownButton } from '@/components/DropdownLink'
import ApplicationLogo from '@/components/ApplicationLogo'

import { UserType } from '@/types/User'
import { useAuth } from '@/hooks/auth'
import { Badge } from '../ui/badge'


const roleBadge = (role: string) => {
    switch (role) {
        case 'admin':
            return <Badge variant="secondary" className='bg-red-100 text-red-800'>Admin</Badge>
        case 'user':
            return <Badge variant="secondary" className='bg-blue-100 text-blue-800'>User</Badge>
        default:
            return <Badge variant="secondary" className='bg-gray-100 text-gray-800'>Guest</Badge>
    }
}

const Navigation = ({ user }: { user: UserType }) => {
    const pathname = usePathname()

    const { logout } = useAuth({})
    const [open, setOpen] = useState<boolean>(false)

    return (
        <nav className="bg-white border-b border-gray-100">
            {/* Primary Navigation Menu */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="shrink-0 flex items-center">
                            <Link href="/dashboard">
                                <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600" />
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink href="/admin/dashboard" active={pathname === '/admin/dashboard'}>
                                Dashboard
                            </NavLink>

                            <NavLink href="/admin/users" active={pathname === '/admin/users'}>
                                Users
                            </NavLink>

                            <NavLink href="/admin/pages" active={pathname === '/admin/pages'}>
                                Pages
                            </NavLink>
                        </div>
                    </div>

                    {/* Settings Dropdown */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <Dropdown
                            align="right"
                            width={48}
                            trigger={
                                <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                    <div>{user?.name}</div>
                                    <div className="ml-2">{roleBadge(user?.role)}</div>

                                    <div className="ml-1">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            }>
                            {/* Authentication */}
                            <DropdownButton onClick={logout}>Logout</DropdownButton>
                        </Dropdown>
                    </div>

                    {/* Hamburger */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setOpen(open => !open)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24">
                                {open ? (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Responsive Navigation Menu */}
            {open && (
                <div className="block sm:hidden">
                    <div className="pt-2 pb-2 space-y-1">
                        <ResponsiveNavLink
                            href="/admin/dashboard"
                            active={pathname === '/admin/dashboard'}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>
                    <div className="pt-2 pb-2 space-y-1">
                        <ResponsiveNavLink
                            href="/admin/users"
                            active={pathname === '/admin/users'}>
                            Users
                        </ResponsiveNavLink>
                    </div>
                    <div className="pt-2 pb-2 space-y-1">
                        <ResponsiveNavLink
                            href="/admin/pages"
                            active={pathname === '/admin/pages'}>
                            Pages
                        </ResponsiveNavLink>
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="shrink-0">
                                {user?.avatar ? (
                                    <Image
                                        src={`http://localhost:8000/storage/${user.avatar}`}
                                        width={40}
                                        height={40}
                                        alt="Picture of the author"
                                        className="rounded-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-600 font-medium">{user?.name?.charAt(0)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="ml-3">
                                <div className="font-medium text-base text-gray-800">
                                    {user?.name}
                                </div>
                                <div className="font-medium text-base text-gray-800">
                                    {roleBadge(user?.role || '')}
                                </div>
                                <div className="font-medium text-sm text-gray-500">
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {/* Authentication */}
                            <ResponsiveNavButton onClick={logout}>Logout</ResponsiveNavButton>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navigation
