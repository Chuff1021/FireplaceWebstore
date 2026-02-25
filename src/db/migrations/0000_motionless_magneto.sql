CREATE TABLE `admin_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `admin_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_username_unique` ON `admin_users` (`username`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`parent_id` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`short_description` text DEFAULT '' NOT NULL,
	`price` real DEFAULT 0 NOT NULL,
	`sale_price` real,
	`sku` text,
	`brand` text DEFAULT '' NOT NULL,
	`category_id` integer,
	`image` text DEFAULT '' NOT NULL,
	`images` text DEFAULT '[]' NOT NULL,
	`specs` text DEFAULT '{}' NOT NULL,
	`features` text DEFAULT '[]' NOT NULL,
	`in_stock` integer DEFAULT true NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`is_new` integer DEFAULT false NOT NULL,
	`is_sale` integer DEFAULT false NOT NULL,
	`rating` real DEFAULT 0 NOT NULL,
	`review_count` integer DEFAULT 0 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);