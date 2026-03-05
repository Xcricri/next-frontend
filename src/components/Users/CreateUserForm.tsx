"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"

import * as Yup from 'yup'
import React, { useState } from "react"
import Image from "next/image"

import { useCreateUser } from "@/hooks/use-data-user"

interface CreateUserFormValues {
    name: string
    email: string
    password: string
    role: "user" | "admin"
    avatar?: FileList
}

const createUserSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    role: Yup.string()
        .oneOf(["user", "admin"], "Invalid role")
        .required("Role is required"),
    avatar: Yup.mixed()
        .nullable()
        .test("fileSize", "Max size is 2MB", (value) => {
            if (!value || !(value instanceof FileList) || value.length === 0) return true;
            return value[0].size <= 2000000;
        })
        .test("fileType", "Supported formats: JPG, PNG", (value) => {
            if (!value || !(value instanceof FileList) || value.length === 0) return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type);
        }),
})

export function CreateUserForm({ ...props }: React.ComponentProps<typeof Card>) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateUserFormValues>({
        resolver: yupResolver(createUserSchema) as any
    })


    const [preview, setPreview] = useState<string | null>(null);

    const { mutate: createUser } = useCreateUser()

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit((data) => {
                        const formData = new FormData()

                        formData.append("name", data.name)
                        formData.append("email", data.email)
                        formData.append("password", data.password)
                        formData.append("role", data.role)

                        if (data.avatar && data.avatar instanceof FileList && data.avatar.length > 0) {
                            formData.append("avatar", data.avatar[0]); // Ambil file ke-0
                        }

                        createUser(formData)
                    })}
                >
                    <FieldGroup>
                        {/* Name */}
                        <Field>
                            <FieldLabel htmlFor="name">Full Name</FieldLabel>
                            <Input id="name" type="text" placeholder="John Doe" {...register("name")} />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </Field>

                        {/* Email */}
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register("email")}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            <FieldDescription>
                                We&apos;ll use this to contact you. We will not share your email
                                with anyone else.
                            </FieldDescription>
                        </Field>

                        {/* Password */}
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input id="password" type="password" {...register("password")} />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            <FieldDescription>
                                Must be at least 8 characters long.
                            </FieldDescription>
                        </Field>

                        {/* Avatar */}
                        <Field>
                            <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                {...register("avatar", {
                                    onChange: (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // Buat URL preview
                                            const url = URL.createObjectURL(file);
                                            setPreview(url);
                                            return () => URL.revokeObjectURL(url);
                                        }
                                    }
                                })}
                            />
                            {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar.message}</p>}

                            {/* Tampilan Preview */}
                            {preview && (
                                <div className="mt-4">
                                    <p className="text-sm mb-2 text-gray-500">Preview:</p>
                                    <Image
                                        src={preview}
                                        width={96}
                                        height={96}
                                        alt="Avatar preview"
                                        className="rounded-full object-cover border-2 border-gray-200"
                                    />
                                </div>
                            )}
                        </Field>

                        {/* Role */}
                        <Field >
                            <FieldLabel htmlFor="role">
                                Role
                            </FieldLabel>
                            <select id="role" {...register("role")}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && <p className="text-red-500">{errors.role.message}</p>}
                        </Field>

                        {/* Button */}
                        <FieldGroup>
                            <Field>
                                <Button type="submit">Create Account</Button>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
