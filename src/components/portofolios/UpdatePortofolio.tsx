"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Import ui component
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// Import libraries
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Import hooks
import { useUpdatePortofolio, useGetPortofolioById } from "@/hooks/use-data-portofolio";

// immport utility                                                  
import { getImageUrl } from "../../../function/Image";
import { typePortoImage } from "@/types/PortofolioImage";

// Interface form
interface FormValues {
    title: string
    short_description: string
    full_content: string
    main_image_url: FileList | null
}

// Yup schema
const schema = Yup.object({
    title: Yup.string().required("Title is required"),
    short_description: Yup.string().required("Short description is required"),
    full_content: Yup.string().required("Full content is required"),
    main_image_url: Yup.mixed()
        .nullable()
        .test("fileSize", "Max size is 2MB", (value) => {
            if (!value || !(value instanceof FileList) || value.length === 0) return true;
            return value[0].size <= 2000000;
        })
        .test("fileType", "Supported formats: JPG, PNG", (value) => {
            if (!value || !(value instanceof FileList) || value.length === 0) return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type);
        }),
});

export default function UpdatePortofolioForm({ pageId }: { pageId?: string }) {

    // Inisialisasi form dari useForm
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema) as any,
    });

    // Fungsi dari custom hook
    const { updatePortofolio } = useUpdatePortofolio();
    const { data, isLoading } = useGetPortofolioById(pageId || "");

    // State
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [preview, setPreview] = useState<string | null>(null);

    // UseEffect untuk mengisi data
    useEffect(() => {
        if (!data) return;

        setValue("title", data.title);
        setValue("short_description", data.short_description);
        setValue("full_content", data.full_content);
    }, [data, setValue]);

    // UseEffect untuk priview gambar
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // Submit form function
    const onSubmit: SubmitHandler<FormValues> = (form) => {
        const formData = new FormData();

        formData.append("title", form.title);
        formData.append("short_description", form.short_description);
        formData.append("full_content", form.full_content);

        if (form.main_image_url?.[0]) {
            formData.append("main_image", form.main_image_url[0]);
        }

        galleryImages.forEach((file) => {
            formData.append("images[]", file);
        });

        updatePortofolio(pageId || "", formData);
    };
    const { onChange, ...fileInput } = register("main_image_url");

    // Loading
    if (isLoading) return <p>Loading...</p>;

    return (
        <Card>
            {/* Header */}
            <CardHeader>
                <CardTitle>Update Portofolio</CardTitle>
                <CardDescription>Edit portofolio information</CardDescription>
            </CardHeader>

            {/* Content */}
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>

                        {/* Title */}
                        <Field>
                            <FieldLabel>Title</FieldLabel>
                            <Input {...register("title")} />
                            {errors.title && (
                                <p className="text-red-500 text-sm">{errors.title.message}</p>
                            )}
                        </Field>

                        {/* Short Description */}
                        <Field>
                            <FieldLabel>Short Description</FieldLabel>
                            <Textarea {...register("short_description")} />
                            {errors.short_description && (
                                <p className="text-red-500 text-sm">{errors.short_description.message}</p>
                            )}
                        </Field>

                        {/* Full Content */}
                        <Field>
                            <FieldLabel>Full Content</FieldLabel>
                            <Textarea {...register("full_content")} />
                            {errors.full_content && (
                                <p className="text-red-500 text-sm">{errors.full_content.message}</p>
                            )}
                        </Field>

                        {/* Image Upload */}
                        <Field>
                            <FieldLabel>Main Image</FieldLabel>

                            <Input
                                type="file"
                                {...fileInput}
                                onChange={(e) => {
                                    onChange(e);

                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />

                            {errors.main_image_url && (
                                <p className="text-red-500 text-sm">
                                    {errors.main_image_url.message as string}
                                </p>
                            )}

                            {/* Preview gambar baru */}
                            {preview && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500">New Image Preview</p>
                                    <Image
                                        src={preview}
                                        width={600}
                                        height={400}
                                        alt={data.title}
                                    />
                                </div>
                            )}

                            {/* Gambar lama */}
                            {!preview && data.main_image_url && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500">Current Image</p>
                                    <Image
                                        src={getImageUrl(data.main_image_url || '')}
                                        width={200}
                                        height={150}
                                        alt="current image"
                                        className="rounded object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}

                        </Field>

                        {/* Gallery Images */}
                        <Field>
                            <FieldLabel htmlFor="gallery_images">
                                Gallery-Image
                            </FieldLabel>


                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    setGalleryImages(files);
                                    setGalleryPreviews(files.map(file => URL.createObjectURL(file)));
                                }}
                            />

                            {/* Gallery Image Previews */}
                            {galleryPreviews.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mt-4">
                                    {galleryPreviews.map((src, i) => (
                                        <Image
                                            key={i}
                                            src={src}
                                            width={96}
                                            height={96}
                                            alt={`Gallery preview ${i + 1}`}
                                            className="rounded object-cover border-2 border-gray-200"
                                            unoptimized
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Existing Gallery Images */}
                            {data?.images && data.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mt-4">
                                    {data.images.map((img: typePortoImage) => (
                                        <Image
                                            key={img.id}
                                            src={getImageUrl(img.image_url)}
                                            alt={img.caption || "Gallery image"}
                                            width={96}
                                            height={96}
                                            className="rounded object-cover border-2 border-gray-200"
                                            unoptimized
                                        />
                                    ))}
                                </div>
                            )}
                        </Field>

                        <Button type="submit" disabled={isLoading}>
                            Update Portofolio
                        </Button>

                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}

