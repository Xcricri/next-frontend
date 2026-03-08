// Import Ui component
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Other Import
import { useUpdateUser } from "@/hooks/use-data-user"
import { mutate } from "swr"

// Interface dialog props
interface EditUserDialogProps {
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void
    user?: any
}

export function EditUserDialog({ isEditDialogOpen, setIsEditDialogOpen, user }: EditUserDialogProps) {

    // fungsi updateuser dari custom hook
    const { updateUser } = useUpdateUser()

    // handle submit function
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!user?.id) return

        const formData = new FormData(e.currentTarget)

        if (!formData.has("role") && user.role) formData.append("role", user.role)

        try {
            await updateUser(user.id, formData)
            mutate("/api/users")
            setIsEditDialogOpen(false)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>

            {/* Content */}
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Form Fields */}
                    <div className="grid gap-4 py-4">
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={user?.name} required />
                            </Field>
                            <Field>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" defaultValue={user?.email} required />
                            </Field>
                            <Field>
                                <Label htmlFor="role">Role</Label>
                                <select name="role" id="role" defaultValue={user?.role}>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </Field>
                        </FieldGroup>
                    </div>

                    {/* Dialog footer */}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
