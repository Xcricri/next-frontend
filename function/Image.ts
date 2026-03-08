export const getImageUrl = (path: string | null | undefined) => {
    if (!path) return '';
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${path}`;
}