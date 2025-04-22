DROP INDEX "user_username_unique";--> statement-breakpoint
ALTER TABLE `background` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT ((strftime('%s', 'now') * 1000));--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
ALTER TABLE `background` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT ((strftime('%s', 'now') * 1000));--> statement-breakpoint
ALTER TABLE `contact` ALTER COLUMN "last_update" TO "last_update" integer NOT NULL DEFAULT ((strftime('%s', 'now') * 1000));--> statement-breakpoint
ALTER TABLE `contact` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT ((strftime('%s', 'now') * 1000));--> statement-breakpoint
ALTER TABLE `contact` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT ((strftime('%s', 'now') * 1000));--> statement-breakpoint
ALTER TABLE `contact_info` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT ((strftime('%s', 'now') * 1000));--> statement-breakpoint
ALTER TABLE `contact_info` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT ((strftime('%s', 'now') * 1000));--> statement-breakpoint
ALTER TABLE `interaction` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT ((strftime('%s', 'now') * 1000));--> statement-breakpoint
ALTER TABLE `interaction` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT ((strftime('%s', 'now') * 1000));--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT ((strftime('%s', 'now') * 1000));--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "updated_at" TO "updated_at" integer NOT NULL DEFAULT ((strftime('%s', 'now') * 1000));