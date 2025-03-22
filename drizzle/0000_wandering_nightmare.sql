CREATE TABLE `background` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_id` text NOT NULL,
	`family` text,
	`company` text,
	`likes_dislikes` text,
	`misc_notes` text,
	`created_at` integer DEFAULT CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER) NOT NULL,
	`updated_at` integer DEFAULT CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER) NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contact`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contact` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`relationship` text,
	`birthday` integer,
	`industry` text,
	`location` text,
	`vip` integer DEFAULT 0 NOT NULL,
	`last_update` integer DEFAULT CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER) NOT NULL,
	`last_contacted` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER) NOT NULL,
	`updated_at` integer DEFAULT CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contact_info` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_id` text NOT NULL,
	`main_app` text,
	`email` text,
	`phone_number` text,
	`social_links` text,
	`created_at` integer DEFAULT CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER) NOT NULL,
	`updated_at` integer DEFAULT CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER) NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contact`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `interaction` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_id` text NOT NULL,
	`type` text NOT NULL,
	`date` integer NOT NULL,
	`notes` text,
	`transcript_source` text,
	`ai_suggestions` text,
	`confidence` integer,
	`created_at` integer DEFAULT CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER) NOT NULL,
	`updated_at` integer DEFAULT CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER) NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contact`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer DEFAULT CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER) NOT NULL,
	`updated_at` integer DEFAULT CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);