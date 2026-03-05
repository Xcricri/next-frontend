"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import Image from "next/image";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useUpdatePage, useGetPagesById } from "@/hooks/use-data-page";

interface FormValues {
    title: string;
    slug: string;
    content: string;
    main_image_url?: FileList;
}

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
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema) as any,
    });

    const { updatePage } = useUpdatePage();
    const { data, isLoading } = useGetPagesById(pageId || "");

    const [preview, setPreview] = useState<string | null>(null);

    const currentImage = data?.main_image_url
        ? `http://localhost:8000/storage/${data.main_image_url}`
        : null;

    useEffect(() => {
        if (!data) return;

        setValue("title", data.title);
        setValue("slug", data.slug);
        setValue("content", data.content);
    }, [data, setValue]);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const onSubmit: SubmitHandler<FormValues> = (form) => {
        const formData = new FormData();

        formData.append("title", form.title);
        formData.append("slug", form.slug);
        formData.append("content", form.content);

        if (form.main_image_url?.[0]) {
            formData.append("main_image_url", form.main_image_url[0]);
        }

        updatePage(pageId || "", formData);
    };

    if (isLoading) return <p>Loading...</p>;

    const { onChange, ...fileInput } = register("main_image_url");

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Page</CardTitle>
                <CardDescription>Edit page information</CardDescription>
            </CardHeader>

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
                            {!preview && currentImage && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500">Current Image</p>
                                    <Image
                                        src={currentImage}
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

