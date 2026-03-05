import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "@/lib/axios";

// Fungsi untuk mengambil data dari API
const fetcher = async (url: string) => {
    const response = await axios.get(url);
    return response.data.data;
};

// Fungsi mengambil semua data
export function useGetPages() {
    const { data, error, isLoading } = useSWR('/api/pages', fetcher);
    console.log(data);
    return { data, error, isLoading };
}

// Fungsi ambil data sesuai id
export function useGetPagesById(id: string) {
    const { data, error, isLoading } = useSWR(`/api/pages/${id}`, fetcher);
    return { data, error, isLoading };
}


// CUD Page //


// Fungsi membuat page
export function useCreatePage() {
    const { trigger, isMutating } = useSWRMutation('/api/pages',
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
        const response = await axios.put(`/api/pages/${id}`, data, {
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
        const response = await axios.delete(`/api/pages/${id}`);
        return response.data.data;
    };
    return { deletePage };
}