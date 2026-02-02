export interface Category {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    image: string | null;
    icon: string | null;
    children?: Category[];
}

export interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    getCategoryById: (id: number) => Category | undefined;
    createCategory: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
    updateCategory: (id: number, formData: FormData) => Promise<{ success: boolean; error?: string }>;
    deleteCategory: (id: number) => Promise<{ success: boolean; error?: string }>;
    getFlatCategories: () => Category[];
    getParentCategories: () => Category[];
    getCategoryStats: () => {
        total: number;
        parents: number;
        children: number;
    };
    clearError: () => void;
}