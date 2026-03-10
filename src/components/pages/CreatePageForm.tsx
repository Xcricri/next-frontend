"use client";

import React, { useState } from 'react'
import Image from 'next/image'

// Import Ui Component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

// Import Libraries
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from 'react-hook-form'

// import hook
import { useCreatePage } from '@/hooks/use-data-page'

// Type Create form
interface CreatePageFormValues {
    title: string,
    content: string,
    main_image_url: FileList | null
}

// Yup Schema
const createYupSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    main_image_url: Yup.mixed().nullable()
        .test("required", "Main image URL is required", (value) => {
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


const CreatePageForm = () => {
    // Inisialisasi Form dari useForm
    const { register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreatePageFormValues>({
        resolver: yupResolver(createYupSchema) as any
    })

    // Preview state
    const [preview, setPreview] = useState<string | null>(null);

    // Create Hook
    const { mutate: createPage } = useCreatePage()

    return (
        <>
            <Card>
                {/* Header */}
                <CardHeader>
                    <CardTitle>Create a page</CardTitle>
                    <CardDescription>
                        Enter your page information below
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
                            formData.append("content", data.content)
                            if (data.main_image_url && data.main_image_url instanceof FileList && data.main_image_url.length > 0) {
                                formData.append("main_image", data.main_image_url[0])
                            }

                            createPage(formData)
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
                                <FieldLabel htmlFor="content">Content</FieldLabel>
                                <Textarea id="content" placeholder="Page content" {...register("content")} />
                                {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
                            </Field>

                            {/* Main Image URL */}
                            <Field>
                                <FieldLabel htmlFor="main_image_url">Main Image</FieldLabel>
                                <Input
                                    id="main_image_url"
                                    type="file"
                                    accept="image/*"
                                    {...register("main_image_url", {
                                        onChange: (e) => {
                                            const file = e.target.files[0]
                                            if (file) {
                                                setPreview(URL.createObjectURL(file))
                                            }
                                        }
                                    })}
                                />
                                {errors.main_image_url && <p className="text-red-500 text-sm">{errors.main_image_url.message}</p>}

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
            </Card >
        </>
    )
}

export default CreatePageForm