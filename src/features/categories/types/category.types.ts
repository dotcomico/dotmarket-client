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
}