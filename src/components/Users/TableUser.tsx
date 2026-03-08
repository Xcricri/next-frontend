import { useState } from "react"
import Image from "next/image"

// Import UI components
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MoreHorizontalIcon } from "lucide-react"

// Import custom components
import { EditUserDialog } from "./EditUserDialog"
import { useGetAllUser } from "@/hooks/use-data-user"
import { useDeleteUser } from "@/hooks/use-data-user"
import { getImageUrl } from "../../../function/Image"
import { UserType } from "@/types/User"

// Badge sesuai role
const RoleBadge = ({ role }: { role: string }) => {
    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-red-100 text-red-800"
            case "user":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
            {role}
        </span>
    )
}

export function TableUser() {

    // State
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserType | undefined>(undefined)

    // Get data
    const { users, error, isLoading } = useGetAllUser()

    // Handle edit function
    const handleEdit = (user: UserType) => {
        setSelectedUser(user)
        setIsEditDialogOpen(true)
    }


    // Handle delete function
    const { deleteUser } = useDeleteUser()
    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id); // tinggal panggil
            console.log("User deleted");
        } catch (error) {
            console.error(error);
        }
    };

    // Loading & error
    if (isLoading) return <div>Loading users...</div>
    if (error) return <div>Failed to load users.</div>

    return (

        <>
            <Table>
                {/* Header */}
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Create At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                {/* Body */}
                <TableBody>
                    {users?.map((user: UserType) => (
                        <TableRow key={user.id}>
                            {/* nomor */}
                            <TableCell>{user.id}</TableCell>

                            {/* Nama */}
                            <TableCell className="font-medium">{user.name}</TableCell>

                            {/* Email */}
                            <TableCell>{user.email}</TableCell>

                            {/* Avatar */}
                            <TableCell>
                                {user?.avatar ? (
                                    <Image
                                        src={getImageUrl(user.avatar)}
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
                            </TableCell>

                            {/* Role */}
                            <TableCell><RoleBadge role={user.role} /></TableCell>

                            {/* Tanggal dibuat */}
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>

                            {/* Actions */}
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontalIcon className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-500" onClick={() => {
                                            if (confirm("Are you sure you want to delete this user?")) {
                                                handleDelete(user.id.toString());
                                            }
                                        }}>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody >
            </Table >

            {/* Edit User Dialog Component */}
            <EditUserDialog
                isEditDialogOpen={isEditDialogOpen}
                setIsEditDialogOpen={setIsEditDialogOpen}
                user={selectedUser}
            />
        </>
    )
}
