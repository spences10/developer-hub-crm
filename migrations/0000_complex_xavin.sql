CREATE TABLE `background` (
	`background_id` integer PRIMARY KEY NOT NULL,
	`contact_id` integer NOT NULL,
	`family` text,
	`company` text,
	`likes_dislikes` text,
	`misc_notes` text,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`contact_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contact_info` (
	`contact_info_id` integer PRIMARY KEY NOT NULL,
	`contact_id` integer NOT NULL,
	`main_app` text,
	`email` text,
	`phone_number` text,
	`social_links` text,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`contact_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`contact_id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`relationship` text,
	`birthday` integer,
	`industry` text,
	`location` text,
	`vip` integer DEFAULT 0,
	`last_update` integer,
	`last_contacted` integer,
	`status` text DEFAULT 'All Good',
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `interactions` (
	`interaction_id` integer PRIMARY KEY NOT NULL,
	`contact_id` integer NOT NULL,
	`type` text,
	`date` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`contact_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	`first_name` text,
	`last_name` text,
	`username` text(32) NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_key` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	`user_id` text NOT NULL,
	`hashed_password` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	`user_id` text NOT NULL,
	`active_expires` integer NOT NULL,
	`idle_expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);