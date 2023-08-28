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
	`name` text NOT NULL,
	`relationship` text,
	`birthday` text,
	`industry` text,
	`location` text,
	`vip` integer DEFAULT 0,
	`last_update` text,
	`last_contacted` text,
	`status` text DEFAULT 'All Good'
);
--> statement-breakpoint
CREATE TABLE `interactions` (
	`interaction_id` integer PRIMARY KEY NOT NULL,
	`contact_id` integer NOT NULL,
	`type` text,
	`date` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`contact_id`) ON UPDATE no action ON DELETE no action
);
