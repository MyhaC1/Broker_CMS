import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_cabinet_home_modules_type" AS ENUM('profile', 'onboarding', 'balance', 'markets', 'promotions');
  CREATE TYPE "public"."enum_site_cabinet_home_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_cabinet_home_v_version_modules_type" AS ENUM('profile', 'onboarding', 'balance', 'markets', 'promotions');
  CREATE TYPE "public"."enum__site_cabinet_home_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_cabinet_home_v_published_locale" AS ENUM('ru', 'en');
  CREATE TABLE "site_cabinet_home_modules_new_listing_symbols" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"symbol" varchar
  );
  
  CREATE TABLE "site_cabinet_home_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_site_cabinet_home_modules_type",
  	"enabled" boolean DEFAULT true,
  	"steps_verification" boolean DEFAULT true,
  	"steps_deposit" boolean DEFAULT true,
  	"steps_first_trade" boolean DEFAULT true,
  	"buttons_deposit" boolean DEFAULT true,
  	"buttons_withdraw" boolean DEFAULT true,
  	"buttons_buy_fiat" boolean DEFAULT true,
  	"tabs_assets" boolean DEFAULT true,
  	"tabs_popular" boolean DEFAULT true,
  	"tabs_new_listing" boolean DEFAULT true,
  	"tabs_favorites" boolean DEFAULT false,
  	"tabs_gainers" boolean DEFAULT true,
  	"tabs_volume" boolean DEFAULT true
  );
  
  CREATE TABLE "site_cabinet_home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_cabinet_home_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_cabinet_home_v_version_modules_new_listing_symbols" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"symbol" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_cabinet_home_v_version_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__site_cabinet_home_v_version_modules_type",
  	"enabled" boolean DEFAULT true,
  	"steps_verification" boolean DEFAULT true,
  	"steps_deposit" boolean DEFAULT true,
  	"steps_first_trade" boolean DEFAULT true,
  	"buttons_deposit" boolean DEFAULT true,
  	"buttons_withdraw" boolean DEFAULT true,
  	"buttons_buy_fiat" boolean DEFAULT true,
  	"tabs_assets" boolean DEFAULT true,
  	"tabs_popular" boolean DEFAULT true,
  	"tabs_new_listing" boolean DEFAULT true,
  	"tabs_favorites" boolean DEFAULT false,
  	"tabs_gainers" boolean DEFAULT true,
  	"tabs_volume" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_cabinet_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_cabinet_home_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_cabinet_home_v_published_locale",
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "site_cabinet_home_id" integer;
  ALTER TABLE "site_cabinet_home_modules_new_listing_symbols" ADD CONSTRAINT "site_cabinet_home_modules_new_listing_symbols_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_cabinet_home_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_cabinet_home_modules" ADD CONSTRAINT "site_cabinet_home_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_cabinet_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_cabinet_home" ADD CONSTRAINT "site_cabinet_home_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_cabinet_home_v_version_modules_new_listing_symbols" ADD CONSTRAINT "_site_cabinet_home_v_version_modules_new_listing_symbols_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_cabinet_home_v_version_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_cabinet_home_v_version_modules" ADD CONSTRAINT "_site_cabinet_home_v_version_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_cabinet_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_cabinet_home_v" ADD CONSTRAINT "_site_cabinet_home_v_parent_id_site_cabinet_home_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_cabinet_home"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_cabinet_home_v" ADD CONSTRAINT "_site_cabinet_home_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_cabinet_home_modules_new_listing_symbols_order_idx" ON "site_cabinet_home_modules_new_listing_symbols" USING btree ("_order");
  CREATE INDEX "site_cabinet_home_modules_new_listing_symbols_parent_id_idx" ON "site_cabinet_home_modules_new_listing_symbols" USING btree ("_parent_id");
  CREATE INDEX "site_cabinet_home_modules_order_idx" ON "site_cabinet_home_modules" USING btree ("_order");
  CREATE INDEX "site_cabinet_home_modules_parent_id_idx" ON "site_cabinet_home_modules" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_cabinet_home_site_idx" ON "site_cabinet_home" USING btree ("site_id");
  CREATE INDEX "site_cabinet_home_updated_at_idx" ON "site_cabinet_home" USING btree ("updated_at");
  CREATE INDEX "site_cabinet_home_created_at_idx" ON "site_cabinet_home" USING btree ("created_at");
  CREATE INDEX "site_cabinet_home__status_idx" ON "site_cabinet_home" USING btree ("_status");
  CREATE INDEX "_site_cabinet_home_v_version_modules_new_listing_symbols_order_idx" ON "_site_cabinet_home_v_version_modules_new_listing_symbols" USING btree ("_order");
  CREATE INDEX "_site_cabinet_home_v_version_modules_new_listing_symbols_parent_id_idx" ON "_site_cabinet_home_v_version_modules_new_listing_symbols" USING btree ("_parent_id");
  CREATE INDEX "_site_cabinet_home_v_version_modules_order_idx" ON "_site_cabinet_home_v_version_modules" USING btree ("_order");
  CREATE INDEX "_site_cabinet_home_v_version_modules_parent_id_idx" ON "_site_cabinet_home_v_version_modules" USING btree ("_parent_id");
  CREATE INDEX "_site_cabinet_home_v_parent_idx" ON "_site_cabinet_home_v" USING btree ("parent_id");
  CREATE INDEX "_site_cabinet_home_v_version_version_site_idx" ON "_site_cabinet_home_v" USING btree ("version_site_id");
  CREATE INDEX "_site_cabinet_home_v_version_version_updated_at_idx" ON "_site_cabinet_home_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_cabinet_home_v_version_version_created_at_idx" ON "_site_cabinet_home_v" USING btree ("version_created_at");
  CREATE INDEX "_site_cabinet_home_v_version_version__status_idx" ON "_site_cabinet_home_v" USING btree ("version__status");
  CREATE INDEX "_site_cabinet_home_v_created_at_idx" ON "_site_cabinet_home_v" USING btree ("created_at");
  CREATE INDEX "_site_cabinet_home_v_updated_at_idx" ON "_site_cabinet_home_v" USING btree ("updated_at");
  CREATE INDEX "_site_cabinet_home_v_snapshot_idx" ON "_site_cabinet_home_v" USING btree ("snapshot");
  CREATE INDEX "_site_cabinet_home_v_published_locale_idx" ON "_site_cabinet_home_v" USING btree ("published_locale");
  CREATE INDEX "_site_cabinet_home_v_latest_idx" ON "_site_cabinet_home_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_cabinet_home_fk" FOREIGN KEY ("site_cabinet_home_id") REFERENCES "public"."site_cabinet_home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_site_cabinet_home_id_idx" ON "payload_locked_documents_rels" USING btree ("site_cabinet_home_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_cabinet_home_modules_new_listing_symbols" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_cabinet_home_modules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_cabinet_home" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_cabinet_home_v_version_modules_new_listing_symbols" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_cabinet_home_v_version_modules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_cabinet_home_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_cabinet_home_modules_new_listing_symbols" CASCADE;
  DROP TABLE "site_cabinet_home_modules" CASCADE;
  DROP TABLE "site_cabinet_home" CASCADE;
  DROP TABLE "_site_cabinet_home_v_version_modules_new_listing_symbols" CASCADE;
  DROP TABLE "_site_cabinet_home_v_version_modules" CASCADE;
  DROP TABLE "_site_cabinet_home_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_site_cabinet_home_fk";
  
  DROP INDEX "payload_locked_documents_rels_site_cabinet_home_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "site_cabinet_home_id";
  DROP TYPE "public"."enum_site_cabinet_home_modules_type";
  DROP TYPE "public"."enum_site_cabinet_home_status";
  DROP TYPE "public"."enum__site_cabinet_home_v_version_modules_type";
  DROP TYPE "public"."enum__site_cabinet_home_v_version_status";
  DROP TYPE "public"."enum__site_cabinet_home_v_published_locale";`)
}
