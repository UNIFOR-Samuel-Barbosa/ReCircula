export interface Announce {
	id: string;
	user_id: string;
	image_url: string;
	title: string;
	description: string | null;
  category: string;
	price: number | null;
	donation: boolean;
	created_at: string;
}

export interface CreateAnnounceDTO {
	id: string;
	user_id: string;
	image_url: string;
	title: string;
	description?: string;
  category: string;
	price?: number | null;
	donation: boolean;
}

export interface UpdateAnnounceDTO {
	image_url?: string;

	title?: string;

	description?: string;

  category?: string;

	price?: number | null;

	donation?: boolean;
}

export type SortOption =
    | ""
    | "recent"
    | "price-asc"
    | "price-desc";

export interface AnnounceFilters {
	category?: string;
	donation?: boolean;
	search?: string;
	user_id?: string;
	sort?: SortOption;
}

export type CategoryRow = {
	category: string;
};