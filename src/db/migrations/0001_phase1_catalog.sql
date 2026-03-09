ALTER TABLE `products` ADD `manufacturer_sku` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `products` ADD `fuel_type` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `products` ADD `vent_type` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `products` ADD `width_inches` real;
--> statement-breakpoint
ALTER TABLE `products` ADD `btu_output` integer;
--> statement-breakpoint
ALTER TABLE `products` ADD `source_id` integer;
--> statement-breakpoint
ALTER TABLE `products` ADD `lifecycle_status` text DEFAULT 'draft' NOT NULL;
--> statement-breakpoint
ALTER TABLE `products` ADD `compliance_status` text DEFAULT 'green' NOT NULL;
--> statement-breakpoint
CREATE TABLE `catalog_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`type` text DEFAULT 'manufacturer' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `catalog_sources_slug_unique` ON `catalog_sources` (`slug`);
--> statement-breakpoint
CREATE TABLE `license_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` integer NOT NULL,
	`approval_ref` text NOT NULL,
	`allowed_asset_types` text DEFAULT '[]' NOT NULL,
	`usage_scope` text DEFAULT '' NOT NULL,
	`expires_at` integer,
	`owner_contact` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'green' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `import_jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` integer,
	`job_type` text DEFAULT 'fireplace_catalog' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`total_count` integer DEFAULT 0 NOT NULL,
	`success_count` integer DEFAULT 0 NOT NULL,
	`error_count` integer DEFAULT 0 NOT NULL,
	`started_at` integer,
	`finished_at` integer,
	`summary` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `import_job_errors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL,
	`row_key` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`payload` text DEFAULT '' NOT NULL,
	`created_at` integer
);
