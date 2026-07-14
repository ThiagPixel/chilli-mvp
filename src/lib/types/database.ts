export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					email: string;
					full_name: string | null;
					avatar_url: string | null;
					bio: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					email: string;
					full_name?: string | null;
					avatar_url?: string | null;
					bio?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					full_name?: string | null;
					avatar_url?: string | null;
					bio?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			rpg_tables: {
				Row: {
					id: string;
					name: string;
					description: string | null;
					master_id: string;
					invite_code: string;
					is_active: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					description?: string | null;
					master_id: string;
					invite_code?: string;
					is_active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					description?: string | null;
					master_id?: string;
					invite_code?: string;
					is_active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
			rpg_table_members: {
				Row: {
					id: string;
					table_id: string;
					user_id: string;
					role: "master" | "player";
					display_name: string | null;
					joined_at: string;
				};
				Insert: {
					id?: string;
					table_id: string;
					user_id: string;
					role: "master" | "player";
					display_name?: string | null;
					joined_at?: string;
				};
				Update: {
					id?: string;
					table_id?: string;
					user_id?: string;
					role?: "master" | "player";
					display_name?: string | null;
					joined_at?: string;
				};
			};
			table_messages: {
				Row: {
					id: string;
					table_id: string;
					user_id: string;
					content: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					table_id: string;
					user_id: string;
					content: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					table_id?: string;
					user_id?: string;
					content?: string;
					created_at?: string;
				};
			};
			table_rolls: {
				Row: {
					id: string;
					table_id: string;
					user_id: string;
					character_name: string | null;
					expression: string;
					result: number;
					rolls: Json;
					created_at: string;
				};
				Insert: {
					id?: string;
					table_id: string;
					user_id: string;
					character_name?: string | null;
					expression: string;
					result: number;
					rolls: Json;
					created_at?: string;
				};
				Update: {
					id?: string;
					table_id?: string;
					user_id?: string;
					character_name?: string | null;
					expression?: string;
					result?: number;
					rolls?: Json;
					created_at?: string;
				};
			};
			character_sheets: {
				Row: {
					id: string;
					table_id: string;
					user_id: string;
					name: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					table_id: string;
					user_id: string;
					name: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					table_id?: string;
					user_id?: string;
					name?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			character_sheet_fields: {
				Row: {
					id: string;
					sheet_id: string;
					name: string;
					field_type: string;
					field_order: number;
					options: Json;
					created_at: string;
				};
				Insert: {
					id?: string;
					sheet_id: string;
					name: string;
					field_type?: string;
					field_order?: number;
					options?: Json;
					created_at?: string;
				};
				Update: {
					id?: string;
					sheet_id?: string;
					name?: string;
					field_type?: string;
					field_order?: number;
					options?: Json;
					created_at?: string;
				};
			};
			character_sheet_values: {
				Row: {
					id: string;
					sheet_id: string;
					field_id: string;
					value: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					sheet_id: string;
					field_id: string;
					value?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					sheet_id?: string;
					field_id?: string;
					value?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
		};
		Views: {};
		Functions: {};
		Enums: {};
	};
}
