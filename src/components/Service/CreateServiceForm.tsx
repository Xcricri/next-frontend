"use client";

import React, { useState } from 'react'
import Image from 'next/image'

// Import Ui component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

// import libraries
import { useCreateService } from '@/hooks/use-data-service';
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"

// Type Create form
interface CreateServiceFormValues {
    title: string
    description: string
    main_image: FileList | null
}

// Yup Schema
const createYupSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    main_image: Yup.mixed().nullable()
        .test("required", "Main image is required", (value) => {
            return value instanceof FileList && value.length > 0;
        })
        .test("fileSize", "Max size is 2MB", (value) => {
            const files = value as FileList;
            return files && files[0]?.size <= 2000000;
        })
        .test("fileType", "Supported formats: JPG, PNG", (value) => {
            const files = value as FileList;
            return files && ["image/jpeg", "image/png", "image/jpg"].includes(files[0]?.type);
        }),
})

const CreateServiceForm = () => {
    // inisialisasi form
    const { register, handleSubmit, formState: { errors } } = useForm<CreateServiceFormValues>({
        resolver: yupResolver(createYupSchema) as any
    })

    // Priview state
    const [preview, setPreview] = useState<string | null>(null);

    // Create Hook
    const { mutate: createService } = useCreateService()

    return (
        <>
            <Card>
                {/* Card Header */}
                <CardHeader>
                    <CardTitle>Create a Service</CardTitle>
                    <CardDescription>
                        Enter your Service information below
                    </CardDescription>
                </CardHeader>

                {/* Content */}
                <CardContent>
                    <form
                        // HandleSubmit function
                        onSubmit={handleSubmit((data) => {
                            // Create FormData object
                            const formData = new FormData()

                            // Append form data
                            formData.append("title", data.title)
                            formData.append("description", data.description)
                            if (data.main_image && data.main_image instanceof FileList && data.main_image.length > 0) {
                                formData.append("main_image", data.main_image[0])
                            }

                            createService(formData)
                        })}
                    >
                        <FieldGroup>
                            {/* Title */}
                            <Field>
                                <FieldLabel htmlFor="title">Title</FieldLabel>
                                <Input id="title" type="text" placeholder="Page Title" {...register("title")} />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                            </Field>

                            {/* Content */}
                            <Field>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea id="description" placeholder="Page description" {...register("description")} />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                            </Field>

                            {/* Main Image URL */}
                            <Field>
                                <FieldLabel htmlFor="main_image">Main Image</FieldLabel>
                                <Input
                                    id="main_image"
                                    type="file"
                                    accept="image/*"
                                    {...register("main_image", {
                                        onChange: (e) => {
                                            const file = e.target.files[0]
                                            if (file) {
                                                setPreview(URL.createObjectURL(file))
                                            }
                                        }
                                    })}
                                />
                                {errors.main_image && <p className="text-red-500 text-sm">{errors.main_image.message}</p>}

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

                            {/* Button */}
                            <FieldGroup>
                                <Field>
                                    <Button type="submit">Create Page</Button>
                                </Field>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export { CreateServiceForm }