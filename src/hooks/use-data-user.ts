import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "@/lib/axios";

// Fungsi ambil semua data
export function useGetAllUser() {
    const { data, error, isLoading } = useSWR("/api/users", async () => {
        const response = await axios.get("/api/users");
        return response.data.data;

    });

    return {
        users: data,
        error,
        isLoading,
    };
}

// Fungsi ambil data sesuai id
export function useGetUserById(id: string) {
    const { data, error, isLoading } = useSWR(`/api/users/${id}`, async () => {
        const response = await axios.get(`/api/users/${id}`);
        return response.data.data;
    });

    return {
        user: data,
        error,
        isLoading,
    };
}


// CUD (create, update, delete) //


// Fungsi create user
export function useCreateUser() {
    const { trigger, isMutating } = useSWRMutation(
        "/api/users",
        async (url, { arg }: { arg: FormData }) => {
            const response = await axios.post(url, arg, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                },
            });
            return response.data;
        }
    );

    return {
        mutate: trigger,
        isPending: isMutating,
    }
}

// fungsi update user
export function useUpdateUser() {
    const updateUser = async (id: string, data: FormData) => {
        const response = await axios.put(`/api/users/${id}`, data, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    };

    return { updateUser };
}

// Fungi delete user
export function useDeleteUser() {
    const deleteUser = async (id: string) => {
        const response = await axios.delete(`/api/users/${id}`);
        return response.data;
    };

    return { deleteUser };
}