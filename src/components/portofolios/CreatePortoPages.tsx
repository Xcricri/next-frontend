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
import { useCreatePortofolio } from '@/hooks/use-data-portofolio';
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"

// Type Create form
interface CreatePortoFormValues {
    title: string
    short_description: string
    full_content: string
    project_date: string
    main_image_url: FileList | null
}

// Yup Schema
const createYupSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    short_description: Yup.string().required("Short description is required"),
    full_content: Yup.string().required("Full content is required"),
    project_date: Yup.string().required("Project date is required"),
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

// CreatePortofolio function
const CreatePortofolioForm = () => {

    // Inisialisasi form
    const { register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreatePortoFormValues>({
        resolver: yupResolver(createYupSchema) as any
    })

    // Preview state
    const [preview, setPreview] = useState<string | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    // Create Hook
    const { mutate: createPortofolio } = useCreatePortofolio()

    return (
        <>
            <Card>
                {/* Card Header */}
                <CardHeader>
                    <CardTitle>Create a portofolio</CardTitle>
                    <CardDescription>
                        Enter your portofolio information below
                    </CardDescription>
                </CardHeader>

                {/* Card content */}
                <CardContent>
                    {/* form */}
                    <form
                        // handle submit form function
                        onSubmit={handleSubmit((data) => {
                            // Create FormData object
                            const formData = new FormData()

                            // Append form data
                            formData.append("title", data.title)
                            formData.append("short_description", data.short_description)
                            formData.append("full_content", data.full_content)
                            formData.append("project_date", data.project_date)
                            if (data.main_image_url && data.main_image_url instanceof FileList && data.main_image_url.length > 0) {
                                formData.append("main_image", data.main_image_url[0])
                            }

                            // Append gallery images
                            galleryFiles.forEach((file) => {
                                formData.append("images[]", file)
                            })

                            createPortofolio(formData)
                        })}
                    >
                        <FieldGroup>
                            {/* Title */}
                            <Field>
                                <FieldLabel htmlFor="title">Title</FieldLabel>
                                <Input id="title" type="text" placeholder="Portofolio Title" {...register("title")} />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                            </Field>

                            {/* Project Date */}
                            <Field>
                                <FieldLabel htmlFor="project_date">Project Date</FieldLabel>
                                <Input id="project_date" type="date" {...register("project_date")} />
                                {errors.project_date && <p className="text-red-500 text-sm">{errors.project_date.message}</p>}
                            </Field>

                            {/* Short Description */}
                            <Field>
                                <FieldLabel htmlFor="short_description">Short Description</FieldLabel>
                                <Textarea id="short_description" placeholder="Short description" {...register("short_description")} />
                                {errors.short_description && <p className="text-red-500 text-sm">{errors.short_description.message}</p>}
                            </Field>

                            {/* Full Content */}
                            <Field>
                                <FieldLabel htmlFor="full_content">Full Content</FieldLabel>
                                <Textarea id="full_content" placeholder="Full content" {...register("full_content")} />
                                {errors.full_content && <p className="text-red-500 text-sm">{errors.full_content.message}</p>}
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

                            {/* Gallery Images */}
                            <Field>
                                <FieldLabel htmlFor="gallery_images">Gallery Images</FieldLabel>
                                <Input
                                    id="gallery_images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || [])
                                        setGalleryFiles(files)
                                        // Revoke old previews
                                        galleryPreviews.forEach(url => URL.revokeObjectURL(url))
                                        setGalleryPreviews(files.map(f => URL.createObjectURL(f)))
                                    }}
                                />

                                {/* Gallery Previews */}
                                {galleryPreviews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-4 gap-2">
                                        {galleryPreviews.map((src, i) => (
                                            <Image
                                                key={i}
                                                src={src}
                                                width={96}
                                                height={96}
                                                alt={`Gallery preview ${i + 1}`}
                                                className="rounded object-cover border-2 border-gray-200"
                                            />
                                        ))}
                                    </div>
                                )}
                            </Field>

                            {/* Button */}
                            <FieldGroup>
                                <Field>
                                    <Button type="submit">Create Portofolio</Button>
                                </Field>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card >
        </>
    )
}

export default CreatePortofolioForm