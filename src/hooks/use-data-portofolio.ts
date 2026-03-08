import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "@/lib/axios";

// Fungsi untuk mengambil data dari API
const fetcher = async (url: string) => {
    const response = await axios.get(url);
    return response.data.data;
};

// Fungsi mengambil semua data (admin)
export function useGetPortofolios() {
    const { data, error, isLoading } = useSWR('/api/admin/portfolios', fetcher);
    return { data, error, isLoading };
}

// Fungsi ambil data sesuai id (admin)
export function useGetPortofolioById(id: string) {
    const { data, error, isLoading } = useSWR(id ? `/api/admin/portfolios/${id}` : null, fetcher);
    console.log(data)
    return { data, error, isLoading };
}

// Fungsi ambil data sesuai slug (public)
export function useGetPortofolioBySlug(slug: string) {
    const { data, error, isLoading } = useSWR(slug ? `/api/portfolios/${slug}` : null, fetcher);
    return { data, error, isLoading };
}


// CUD Portofolio //


// Fungsi membuat portofolio
export function useCreatePortofolio() {
    const { trigger, isMutating } = useSWRMutation('/api/admin/portfolios',
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

// Fungsi update Portofolio
export function useUpdatePortofolio() {
    const updatePortofolio = async (id: string, data: FormData) => {
        const response = await axios.put(`/api/admin/portfolios/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
            }
        });
        return response.data.data;
    };
    return { updatePortofolio };
}

// Fungsi delete Portofolio
export function useDeletePortofolio() {
    const deletePortofolio = async (id: string) => {
        const response = await axios.delete(`/api/admin/portfolios/${id}`);
        return response.data.data;
    };
    return { deletePortofolio };
}