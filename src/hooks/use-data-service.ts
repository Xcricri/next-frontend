// Import library
import axios from "@/lib/axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

// Fungsi untuk mengambil data dari API
const fetcher = async (url: string) => {
    const response = await axios.get(url);
    return response.data.data;
};

// Fungsi mengambil semua data (admin)
export function useGetService() {
    const { data, error, isLoading } = useSWR('/api/admin/services', fetcher);
    return { data, error, isLoading };
}

// Fungsi ambil data sesuai id (admin)
export function useGetServiceById(id: string) {
    const { data, error, isLoading } = useSWR(id ? `/api/admin/services/${id}` : null, fetcher);
    console.log(data);
    return { data, error, isLoading };
}

// Fungsi ambil data sesuai slug (public)
export function useGetServiceBySlug(slug: string) {
    const { data, error, isLoading } = useSWR(slug ? `/api/services/${slug}` : null, fetcher);
    return { data, error, isLoading };
}

// CUD Service //

// Create service page
export function useCreateService() {
    const { trigger, isMutating } = useSWRMutation('/api/admin/services',
        async (url, { arg }: { arg: FormData }) => {
            const response = await axios.post(url, arg, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                }
            });
            return response.data;
        });
    return { mutate: trigger, ispending: isMutating };
}

// Update service page
export function useUpdateService() {
    const updatePage = async (id: string, data: FormData) => {
        const response = await axios.put(`/api/admin/services/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
            }
        });
        return response.data;
    };
    return { updatePage };
}

// Fungsi delete Service
export function useDeleteService() {
    const deleteService = async (id: string) => {
        const response = await axios.delete(`/api/admin/services/${id}`);
        return response.data.data;
    };
    return { deleteService };
}