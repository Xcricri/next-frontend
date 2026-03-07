import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "@/lib/axios";

// Fungsi untuk mengambil data dari API
const fetcher = async (url: string) => {
    const response = await axios.get(url);
    return response.data.data;
};

// Fungsi mengambil semua data (admin)
export function useGetPages() {
    const { data, error, isLoading } = useSWR('/api/admin/pages', fetcher);
    return { data, error, isLoading };
}

// Fungsi ambil data sesuai id (admin)
export function useGetPagesById(id: string) {
    const { data, error, isLoading } = useSWR(id ? `/api/admin/pages/${id}/edit` : null, fetcher);
    return { data, error, isLoading };
}

// Fungsi ambil data sesuai slug (public)
export function useGetPageBySlug(slug: string) {
    const { data, error, isLoading } = useSWR(slug ? `/api/pages/${slug}` : null, fetcher);
    return { data, error, isLoading };
}


// CUD Page //


// Fungsi membuat page
export function useCreatePage() {
    const { trigger, isMutating } = useSWRMutation('/api/admin/pages',
        async (url, { arg }: { arg: FormData }) => {
            const response = await axios.post(url, arg, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                }
            });
            return response.data.data;
        });
    return { mutate: trigger, isPending: isMutating };
}

// Fungsi update Page
export function useUpdatePage() {
    const updatePage = async (id: string, data: FormData) => {
        const response = await axios.put(`/api/admin/pages/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
            }
        });
        return response.data.data;
    };
    return { updatePage };
}

// Fungsi delete Page
export function useDeletePage() {
    const deletePage = async (id: string) => {
        const response = await axios.delete(`/api/admin/pages/${id}`);
        return response.data.data;
    };
    return { deletePage };
}