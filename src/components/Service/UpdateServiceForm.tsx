"use client";

import React, { useState } from 'react'
import Image from 'next/image'

// Import Ui component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

// Import custom hook && helper function
import { useUpdateService } from '@/hooks/use-data-service';
import { useGetServiceById } from '@/hooks/use-data-service';
import { getImageUrl } from '../../../function/Image';

// import libraries
import { SubmitHandler, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"

// Type Update form
interface UpdateServiceFormValues {
    title: string
    description: string
    main_image: FileList | null
}

// Yup Schema
const updateYupSchema = Yup.object().shape({
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


const UpdateServiceForm = ({ ServiceId }: { ServiceId: string }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // State dari library react-hook-form
    const { register,
        handleSubmit,
        setValue,
        formState: { errors } }
        = useForm<UpdateServiceFormValues>({
            resolver: yupResolver(updateYupSchema) as any
        });

    // Import custom hook
    const { data, isLoading } = useGetServiceById(ServiceId || "");
    const { updatePage } = useUpdateService();

    // Isi value form
    React.useEffect(() => {
        if (data) {
            setValue("title", data.title);
            setValue("description", data.description);
        }
    }, [data, setValue]);

    // Handle submit form
    const onSubmitForm: SubmitHandler<UpdateServiceFormValues> = (data) => {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("description", data.description);
        if (data.main_image?.[0]) {
            formData.append("main_image", data.main_image[0]);
        }

        updatePage(ServiceId || "", formData);
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Card>
                {/* Card Header */}
                <CardHeader>
                    <CardTitle>Update Page</CardTitle>
                    <CardDescription>Edit page information</CardDescription>
                </CardHeader>

                {/* Card Content */}
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        {/* Form Fields */}
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Title</FieldLabel>
                                <Input {...register("title")} />
                                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                            </Field>

                            <Field>
                                <FieldLabel>Description</FieldLabel>
                                <Textarea {...register("description")} />
                                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                            </Field>

                            {/* Main Image Field */}
                            <Field>
                                <FieldLabel>Main Image</FieldLabel>
                                <Input type="file" {...register("main_image")} onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setPreviewImage(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                                {errors.main_image && <p className="text-red-500">{errors.main_image.message}</p>}
                            </Field>


                            {previewImage && (
                                <Field>
                                    <FieldLabel>New Image</FieldLabel>
                                    <Image
                                        src={previewImage}
                                        width={600}
                                        height={400}
                                        alt={data.title}
                                        className="max-h-40 max-w-40" />
                                </Field>
                            )}

                            {!previewImage && getImageUrl(data.main_image) && (
                                <Field>
                                    <FieldLabel>Old Image</FieldLabel>
                                    <Image
                                        src={getImageUrl(data.main_image)}
                                        width={600}
                                        height={400}
                                        alt={data.title}
                                        unoptimized
                                        className="max-h-40 max-w-40"
                                    />
                                </Field>
                            )}
                        </FieldGroup>

                        {/* Submit button */}
                        <FieldGroup>
                            <Button type="submit">
                                Submit
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default UpdateServiceForm