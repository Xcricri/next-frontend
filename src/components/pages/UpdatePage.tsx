"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Import UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// Import libraries
import { useForm, SubmitHandler } from "react-hook-form";
import { useUpdatePage, useGetPagesById } from "@/hooks/use-data-page";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Import function
import { getImageUrl } from "../../../function/Image";

interface FormValues {
    title: string;
    slug: string;
    content: string;
    main_image_url?: FileList;
}

// Yup schema
const schema = Yup.object({
    title: Yup.string().required("Title is required"),
    slug: Yup.string().required("Slug is required"),
    content: Yup.string().required("Content is required"),
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

export default function UpdatePageForm({ pageId }: { pageId?: string }) {

    // Inisialisasi form
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema) as any,
    });

    // State
    const [preview, setPreview] = useState<string | null>(null);

    // State dari custom hook
    const { updatePage } = useUpdatePage();
    const { data, isLoading } = useGetPagesById(pageId || "");


    // Use effect untuk mengisi data
    useEffect(() => {
        if (!data) return;

        setValue("title", data.title);
        setValue("slug", data.slug);
        setValue("content", data.content);
    }, [data, setValue]);

    // UseEffect untuk priview image
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // Handle form submission function
    const onSubmit: SubmitHandler<FormValues> = (form) => {
        const formData = new FormData();

        formData.append("title", form.title);
        formData.append("slug", form.slug);
        formData.append("content", form.content);

        if (form.main_image_url?.[0]) {
            formData.append("main_image", form.main_image_url[0]);
        }

        updatePage(pageId || "", formData);
    };
    const { onChange, ...fileInput } = register("main_image_url");

    // Render loading state
    if (isLoading) return <p>Loading...</p>;


    return (
        <Card>
            {/* Header */}
            <CardHeader>
                <CardTitle>Update Page</CardTitle>
                <CardDescription>Edit page information</CardDescription>
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

                        {/* Slug */}
                        <Field>
                            <FieldLabel>Slug</FieldLabel>
                            <Input {...register("slug")} />
                            {errors.slug && (
                                <p className="text-red-500 text-sm">{errors.slug.message}</p>
                            )}
                        </Field>

                        {/* Content */}
                        <Field>
                            <FieldLabel>Content</FieldLabel>
                            <Textarea {...register("content")} />
                            {errors.content && (
                                <p className="text-red-500 text-sm">{errors.content.message}</p>
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
                                        width={200}
                                        height={150}
                                        alt="preview"
                                        className="rounded object-cover"
                                    />
                                </div>
                            )}

                            {/* Gambar lama */}
                            {!preview && getImageUrl(data.main_image_url) && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500">Current Image</p>
                                    <Image
                                        src={getImageUrl(data.main_image_url)}
                                        width={200}
                                        height={150}
                                        alt="current image"
                                        className="rounded object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}

                        </Field>

                        <Button type="submit" disabled={isLoading}>
                            Update Page
                        </Button>

                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}

