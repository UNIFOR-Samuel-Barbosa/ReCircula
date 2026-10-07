export interface Profile {
	id: string;
	name: string;
	photo_url: string | null;
	biography: string | null;
	telephone: string | null;
	created_at: string;
}

export interface UpdateProfileDTO {
	name?: string;
	photo_url?: string;
	biography?: string;
	telephone?: string;
}
