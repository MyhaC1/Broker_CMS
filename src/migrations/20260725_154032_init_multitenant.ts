import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_navigation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_navigation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_navigation_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_faq_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_faq_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_faq_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_instruments_items_category" AS ENUM('forex', 'metals', 'crypto', 'indices', 'stocks', 'energy');
  CREATE TYPE "public"."enum_site_instruments_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_instruments_v_version_items_category" AS ENUM('forex', 'metals', 'crypto', 'indices', 'stocks', 'energy');
  CREATE TYPE "public"."enum__site_instruments_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_instruments_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_accounts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_accounts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_accounts_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_promotions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_promotions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_promotions_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_partners_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_academy_articles_level" AS ENUM('beginner', 'intermediate');
  CREATE TYPE "public"."enum_site_academy_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_academy_v_version_articles_level" AS ENUM('beginner', 'intermediate');
  CREATE TYPE "public"."enum__site_academy_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_academy_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_streams_items_provider" AS ENUM('youtube', 'vimeo');
  CREATE TYPE "public"."enum_site_streams_items_status" AS ENUM('live', 'upcoming', 'past');
  CREATE TYPE "public"."enum_site_streams_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_streams_v_version_items_provider" AS ENUM('youtube', 'vimeo');
  CREATE TYPE "public"."enum__site_streams_v_version_items_status" AS ENUM('live', 'upcoming', 'past');
  CREATE TYPE "public"."enum__site_streams_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_streams_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_contacts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_contacts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_contacts_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_careers_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_careers_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_careers_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_legal_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_legal_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_legal_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_system_status_services_status" AS ENUM('operational', 'degraded', 'outage', 'maintenance');
  CREATE TYPE "public"."enum_site_system_status_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_system_status_v_version_services_status" AS ENUM('operational', 'degraded', 'outage', 'maintenance');
  CREATE TYPE "public"."enum__site_system_status_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_system_status_v_published_locale" AS ENUM('ru', 'en');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "sites_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "sites" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"primary_color" varchar DEFAULT '#d4a437' NOT NULL,
  	"demo_start_balance_cents" numeric DEFAULT 1000000 NOT NULL,
  	"webhook_url" varchar,
  	"webhook_secret" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"slug" varchar,
  	"category" varchar,
  	"published_at" timestamp(3) with time zone,
  	"reading_minutes" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"source" varchar,
  	"body_markdown" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_slug" varchar,
  	"version_category" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_reading_minutes" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__articles_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_source" varchar,
  	"version_body_markdown" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_navigation_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_navigation_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "site_navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_navigation_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "site_navigation_locales" (
  	"risk_warning" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_navigation_v_version_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_navigation_v_version_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_navigation_v_version_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_navigation_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_navigation_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_site_navigation_v_locales" (
  	"version_risk_warning" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_faq_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "site_faq_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "site_faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_faq_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_faq_v_version_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_faq_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_faq_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_faq_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_faq_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "site_instruments_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"symbol" varchar,
  	"name" varchar,
  	"category" "enum_site_instruments_items_category",
  	"digits" numeric,
  	"leverage_max" varchar,
  	"spread_from" varchar,
  	"swap_free" boolean DEFAULT true,
  	"icon_id" integer
  );
  
  CREATE TABLE "site_instruments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_instruments_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_instruments_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"symbol" varchar,
  	"name" varchar,
  	"category" "enum__site_instruments_v_version_items_category",
  	"digits" numeric,
  	"leverage_max" varchar,
  	"spread_from" varchar,
  	"swap_free" boolean DEFAULT true,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_instruments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_instruments_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_instruments_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "site_accounts_items_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "site_accounts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"plan_id" varchar,
  	"name" varchar,
  	"description" varchar,
  	"min_deposit" varchar,
  	"featured" boolean DEFAULT false,
  	"pricing_spread_pips" numeric,
  	"pricing_commission_per_lot_r_t" numeric
  );
  
  CREATE TABLE "site_accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_accounts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_accounts_v_version_items_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_accounts_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"plan_id" varchar,
  	"name" varchar,
  	"description" varchar,
  	"min_deposit" varchar,
  	"featured" boolean DEFAULT false,
  	"pricing_spread_pips" numeric,
  	"pricing_commission_per_lot_r_t" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_accounts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_accounts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_accounts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "site_promotions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"promo_id" varchar,
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"terms" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"featured" boolean DEFAULT false,
  	"active_from" timestamp(3) with time zone,
  	"active_to" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_promotions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_promotions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_promotions_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"promo_id" varchar,
  	"badge" varchar,
  	"title" varchar,
  	"description" varchar,
  	"terms" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"featured" boolean DEFAULT false,
  	"active_from" timestamp(3) with time zone,
  	"active_to" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_promotions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_promotions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_promotions_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "site_partners_models_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_partners_models" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "site_partners_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"clients" varchar,
  	"share" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "site_partners_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "site_partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_partners_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_partners_v_version_models_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_partners_v_version_models" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_partners_v_version_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"clients" varchar,
  	"share" varchar,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_partners_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_partners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_partners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_partners_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "site_academy_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"excerpt" varchar,
  	"level" "enum_site_academy_articles_level",
  	"reading_minutes" numeric,
  	"body_markdown" varchar
  );
  
  CREATE TABLE "site_academy_webinars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"webinar_id" varchar,
  	"title" varchar,
  	"speaker" varchar,
  	"speaker_role" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"duration_minutes" numeric,
  	"level" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "site_academy_glossary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"definition" varchar
  );
  
  CREATE TABLE "site_academy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_academy_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_academy_v_version_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"excerpt" varchar,
  	"level" "enum__site_academy_v_version_articles_level",
  	"reading_minutes" numeric,
  	"body_markdown" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_academy_v_version_webinars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"webinar_id" varchar,
  	"title" varchar,
  	"speaker" varchar,
  	"speaker_role" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"duration_minutes" numeric,
  	"level" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_academy_v_version_glossary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"definition" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_academy_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_academy_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_academy_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "site_streams_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"provider" "enum_site_streams_items_provider" DEFAULT 'youtube',
  	"video_id" varchar,
  	"title" varchar,
  	"poster_id" integer,
  	"starts_at" timestamp(3) with time zone,
  	"status" "enum_site_streams_items_status"
  );
  
  CREATE TABLE "site_streams" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_streams_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_streams_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider" "enum__site_streams_v_version_items_provider" DEFAULT 'youtube',
  	"video_id" varchar,
  	"title" varchar,
  	"poster_id" integer,
  	"starts_at" timestamp(3) with time zone,
  	"status" "enum__site_streams_v_version_items_status",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_streams_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_streams_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_streams_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "site_contacts_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"value" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "site_contacts_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" varchar,
  	"country" varchar,
  	"address" varchar
  );
  
  CREATE TABLE "site_contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_contacts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_contacts_v_version_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"value" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_contacts_v_version_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"city" varchar,
  	"country" varchar,
  	"address" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_contacts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_contacts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_contacts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "site_careers_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "site_careers_vacancies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"department" varchar,
  	"location" varchar,
  	"type" varchar,
  	"apply_email" varchar
  );
  
  CREATE TABLE "site_careers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_careers_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_careers_v_version_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_careers_v_version_vacancies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"department" varchar,
  	"location" varchar,
  	"type" varchar,
  	"apply_email" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_careers_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_careers_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_careers_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "site_legal_items_sections_paragraphs_markdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_legal_items_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "site_legal_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"updated_at" varchar,
  	"intro" varchar
  );
  
  CREATE TABLE "site_legal" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_legal_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_legal_v_version_items_sections_paragraphs_markdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_legal_v_version_items_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_legal_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"updated_at" varchar,
  	"intro" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_legal_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_legal_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_legal_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "site_system_status_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_id" varchar,
  	"name" varchar,
  	"description" varchar,
  	"status" "enum_site_system_status_services_status" DEFAULT 'operational',
  	"uptime90d" varchar
  );
  
  CREATE TABLE "site_system_status_incidents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"status" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "site_system_status" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_system_status_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_site_system_status_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_id" varchar,
  	"name" varchar,
  	"description" varchar,
  	"status" "enum__site_system_status_v_version_services_status" DEFAULT 'operational',
  	"uptime90d" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_system_status_v_version_incidents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"status" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_system_status_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_site_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_system_status_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_system_status_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"sites_id" integer,
  	"articles_id" integer,
  	"site_navigation_id" integer,
  	"site_faq_id" integer,
  	"site_instruments_id" integer,
  	"site_accounts_id" integer,
  	"site_promotions_id" integer,
  	"site_partners_id" integer,
  	"site_academy_id" integer,
  	"site_streams_id" integer,
  	"site_contacts_id" integer,
  	"site_careers_id" integer,
  	"site_legal_id" integer,
  	"site_system_status_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sites_socials" ADD CONSTRAINT "sites_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sites" ADD CONSTRAINT "sites_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation_header" ADD CONSTRAINT "site_navigation_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation_footer_columns_links" ADD CONSTRAINT "site_navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation_footer_columns" ADD CONSTRAINT "site_navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation" ADD CONSTRAINT "site_navigation_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_navigation_locales" ADD CONSTRAINT "site_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_navigation_v_version_header" ADD CONSTRAINT "_site_navigation_v_version_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_navigation_v_version_footer_columns_links" ADD CONSTRAINT "_site_navigation_v_version_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_navigation_v_version_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_navigation_v_version_footer_columns" ADD CONSTRAINT "_site_navigation_v_version_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_navigation_v" ADD CONSTRAINT "_site_navigation_v_parent_id_site_navigation_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_navigation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_navigation_v" ADD CONSTRAINT "_site_navigation_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_navigation_v_locales" ADD CONSTRAINT "_site_navigation_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_faq_sections_items" ADD CONSTRAINT "site_faq_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_faq_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_faq_sections" ADD CONSTRAINT "site_faq_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_faq" ADD CONSTRAINT "site_faq_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_faq_v_version_sections_items" ADD CONSTRAINT "_site_faq_v_version_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_faq_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_faq_v_version_sections" ADD CONSTRAINT "_site_faq_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_faq_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_faq_v" ADD CONSTRAINT "_site_faq_v_parent_id_site_faq_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_faq"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_faq_v" ADD CONSTRAINT "_site_faq_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_instruments_items" ADD CONSTRAINT "site_instruments_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_instruments_items" ADD CONSTRAINT "site_instruments_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_instruments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_instruments" ADD CONSTRAINT "site_instruments_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_instruments_v_version_items" ADD CONSTRAINT "_site_instruments_v_version_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_instruments_v_version_items" ADD CONSTRAINT "_site_instruments_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_instruments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_instruments_v" ADD CONSTRAINT "_site_instruments_v_parent_id_site_instruments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_instruments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_instruments_v" ADD CONSTRAINT "_site_instruments_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_accounts_items_features" ADD CONSTRAINT "site_accounts_items_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_accounts_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_accounts_items" ADD CONSTRAINT "site_accounts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_accounts" ADD CONSTRAINT "site_accounts_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_accounts_v_version_items_features" ADD CONSTRAINT "_site_accounts_v_version_items_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_accounts_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_accounts_v_version_items" ADD CONSTRAINT "_site_accounts_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_accounts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_accounts_v" ADD CONSTRAINT "_site_accounts_v_parent_id_site_accounts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_accounts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_accounts_v" ADD CONSTRAINT "_site_accounts_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_promotions_items" ADD CONSTRAINT "site_promotions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_promotions" ADD CONSTRAINT "site_promotions_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_promotions_v_version_items" ADD CONSTRAINT "_site_promotions_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_promotions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_promotions_v" ADD CONSTRAINT "_site_promotions_v_parent_id_site_promotions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_promotions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_promotions_v" ADD CONSTRAINT "_site_promotions_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_partners_models_features" ADD CONSTRAINT "site_partners_models_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_partners_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_partners_models" ADD CONSTRAINT "site_partners_models_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_partners_tiers" ADD CONSTRAINT "site_partners_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_partners_steps" ADD CONSTRAINT "site_partners_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_partners" ADD CONSTRAINT "site_partners_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_partners_v_version_models_features" ADD CONSTRAINT "_site_partners_v_version_models_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_partners_v_version_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_partners_v_version_models" ADD CONSTRAINT "_site_partners_v_version_models_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_partners_v_version_tiers" ADD CONSTRAINT "_site_partners_v_version_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_partners_v_version_steps" ADD CONSTRAINT "_site_partners_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_partners_v" ADD CONSTRAINT "_site_partners_v_parent_id_site_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_partners_v" ADD CONSTRAINT "_site_partners_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_academy_articles" ADD CONSTRAINT "site_academy_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_academy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_academy_webinars" ADD CONSTRAINT "site_academy_webinars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_academy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_academy_glossary" ADD CONSTRAINT "site_academy_glossary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_academy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_academy" ADD CONSTRAINT "site_academy_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_academy_v_version_articles" ADD CONSTRAINT "_site_academy_v_version_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_academy_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_academy_v_version_webinars" ADD CONSTRAINT "_site_academy_v_version_webinars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_academy_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_academy_v_version_glossary" ADD CONSTRAINT "_site_academy_v_version_glossary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_academy_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_academy_v" ADD CONSTRAINT "_site_academy_v_parent_id_site_academy_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_academy"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_academy_v" ADD CONSTRAINT "_site_academy_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_streams_items" ADD CONSTRAINT "site_streams_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_streams_items" ADD CONSTRAINT "site_streams_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_streams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_streams" ADD CONSTRAINT "site_streams_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_streams_v_version_items" ADD CONSTRAINT "_site_streams_v_version_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_streams_v_version_items" ADD CONSTRAINT "_site_streams_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_streams_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_streams_v" ADD CONSTRAINT "_site_streams_v_parent_id_site_streams_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_streams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_streams_v" ADD CONSTRAINT "_site_streams_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_contacts_channels" ADD CONSTRAINT "site_contacts_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_contacts_offices" ADD CONSTRAINT "site_contacts_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_contacts" ADD CONSTRAINT "site_contacts_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_contacts_v_version_channels" ADD CONSTRAINT "_site_contacts_v_version_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_contacts_v_version_offices" ADD CONSTRAINT "_site_contacts_v_version_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_contacts_v" ADD CONSTRAINT "_site_contacts_v_parent_id_site_contacts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_contacts_v" ADD CONSTRAINT "_site_contacts_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_careers_benefits" ADD CONSTRAINT "site_careers_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_careers_vacancies" ADD CONSTRAINT "site_careers_vacancies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_careers" ADD CONSTRAINT "site_careers_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_careers_v_version_benefits" ADD CONSTRAINT "_site_careers_v_version_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_careers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_careers_v_version_vacancies" ADD CONSTRAINT "_site_careers_v_version_vacancies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_careers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_careers_v" ADD CONSTRAINT "_site_careers_v_parent_id_site_careers_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_careers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_careers_v" ADD CONSTRAINT "_site_careers_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_legal_items_sections_paragraphs_markdown" ADD CONSTRAINT "site_legal_items_sections_paragraphs_markdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_legal_items_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_legal_items_sections" ADD CONSTRAINT "site_legal_items_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_legal_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_legal_items" ADD CONSTRAINT "site_legal_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_legal" ADD CONSTRAINT "site_legal_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_legal_v_version_items_sections_paragraphs_markdown" ADD CONSTRAINT "_site_legal_v_version_items_sections_paragraphs_markdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_legal_v_version_items_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_legal_v_version_items_sections" ADD CONSTRAINT "_site_legal_v_version_items_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_legal_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_legal_v_version_items" ADD CONSTRAINT "_site_legal_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_legal_v" ADD CONSTRAINT "_site_legal_v_parent_id_site_legal_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_legal"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_legal_v" ADD CONSTRAINT "_site_legal_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_system_status_services" ADD CONSTRAINT "site_system_status_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_system_status"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_system_status_incidents" ADD CONSTRAINT "site_system_status_incidents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_system_status"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_system_status" ADD CONSTRAINT "site_system_status_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_system_status_v_version_services" ADD CONSTRAINT "_site_system_status_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_system_status_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_system_status_v_version_incidents" ADD CONSTRAINT "_site_system_status_v_version_incidents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_system_status_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_system_status_v" ADD CONSTRAINT "_site_system_status_v_parent_id_site_system_status_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_system_status"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_system_status_v" ADD CONSTRAINT "_site_system_status_v_version_site_id_sites_id_fk" FOREIGN KEY ("version_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sites_fk" FOREIGN KEY ("sites_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_navigation_fk" FOREIGN KEY ("site_navigation_id") REFERENCES "public"."site_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_faq_fk" FOREIGN KEY ("site_faq_id") REFERENCES "public"."site_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_instruments_fk" FOREIGN KEY ("site_instruments_id") REFERENCES "public"."site_instruments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_accounts_fk" FOREIGN KEY ("site_accounts_id") REFERENCES "public"."site_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_promotions_fk" FOREIGN KEY ("site_promotions_id") REFERENCES "public"."site_promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_partners_fk" FOREIGN KEY ("site_partners_id") REFERENCES "public"."site_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_academy_fk" FOREIGN KEY ("site_academy_id") REFERENCES "public"."site_academy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_streams_fk" FOREIGN KEY ("site_streams_id") REFERENCES "public"."site_streams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_contacts_fk" FOREIGN KEY ("site_contacts_id") REFERENCES "public"."site_contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_careers_fk" FOREIGN KEY ("site_careers_id") REFERENCES "public"."site_careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_legal_fk" FOREIGN KEY ("site_legal_id") REFERENCES "public"."site_legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_system_status_fk" FOREIGN KEY ("site_system_status_id") REFERENCES "public"."site_system_status"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "sites_socials_order_idx" ON "sites_socials" USING btree ("_order");
  CREATE INDEX "sites_socials_parent_id_idx" ON "sites_socials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "sites_slug_idx" ON "sites" USING btree ("slug");
  CREATE INDEX "sites_logo_idx" ON "sites" USING btree ("logo_id");
  CREATE INDEX "sites_favicon_idx" ON "sites" USING btree ("favicon_id");
  CREATE INDEX "sites_updated_at_idx" ON "sites" USING btree ("updated_at");
  CREATE INDEX "sites_created_at_idx" ON "sites" USING btree ("created_at");
  CREATE INDEX "articles_site_idx" ON "articles" USING btree ("site_id");
  CREATE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_site_idx" ON "_articles_v" USING btree ("version_site_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_snapshot_idx" ON "_articles_v" USING btree ("snapshot");
  CREATE INDEX "_articles_v_published_locale_idx" ON "_articles_v" USING btree ("published_locale");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_autosave_idx" ON "_articles_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_navigation_header_order_idx" ON "site_navigation_header" USING btree ("_order");
  CREATE INDEX "site_navigation_header_parent_id_idx" ON "site_navigation_header" USING btree ("_parent_id");
  CREATE INDEX "site_navigation_header_locale_idx" ON "site_navigation_header" USING btree ("_locale");
  CREATE INDEX "site_navigation_footer_columns_links_order_idx" ON "site_navigation_footer_columns_links" USING btree ("_order");
  CREATE INDEX "site_navigation_footer_columns_links_parent_id_idx" ON "site_navigation_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "site_navigation_footer_columns_links_locale_idx" ON "site_navigation_footer_columns_links" USING btree ("_locale");
  CREATE INDEX "site_navigation_footer_columns_order_idx" ON "site_navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "site_navigation_footer_columns_parent_id_idx" ON "site_navigation_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "site_navigation_footer_columns_locale_idx" ON "site_navigation_footer_columns" USING btree ("_locale");
  CREATE UNIQUE INDEX "site_navigation_site_idx" ON "site_navigation" USING btree ("site_id");
  CREATE INDEX "site_navigation_updated_at_idx" ON "site_navigation" USING btree ("updated_at");
  CREATE INDEX "site_navigation_created_at_idx" ON "site_navigation" USING btree ("created_at");
  CREATE INDEX "site_navigation__status_idx" ON "site_navigation" USING btree ("_status");
  CREATE UNIQUE INDEX "site_navigation_locales_locale_parent_id_unique" ON "site_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_navigation_v_version_header_order_idx" ON "_site_navigation_v_version_header" USING btree ("_order");
  CREATE INDEX "_site_navigation_v_version_header_parent_id_idx" ON "_site_navigation_v_version_header" USING btree ("_parent_id");
  CREATE INDEX "_site_navigation_v_version_header_locale_idx" ON "_site_navigation_v_version_header" USING btree ("_locale");
  CREATE INDEX "_site_navigation_v_version_footer_columns_links_order_idx" ON "_site_navigation_v_version_footer_columns_links" USING btree ("_order");
  CREATE INDEX "_site_navigation_v_version_footer_columns_links_parent_id_idx" ON "_site_navigation_v_version_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_site_navigation_v_version_footer_columns_links_locale_idx" ON "_site_navigation_v_version_footer_columns_links" USING btree ("_locale");
  CREATE INDEX "_site_navigation_v_version_footer_columns_order_idx" ON "_site_navigation_v_version_footer_columns" USING btree ("_order");
  CREATE INDEX "_site_navigation_v_version_footer_columns_parent_id_idx" ON "_site_navigation_v_version_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "_site_navigation_v_version_footer_columns_locale_idx" ON "_site_navigation_v_version_footer_columns" USING btree ("_locale");
  CREATE INDEX "_site_navigation_v_parent_idx" ON "_site_navigation_v" USING btree ("parent_id");
  CREATE INDEX "_site_navigation_v_version_version_site_idx" ON "_site_navigation_v" USING btree ("version_site_id");
  CREATE INDEX "_site_navigation_v_version_version_updated_at_idx" ON "_site_navigation_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_navigation_v_version_version_created_at_idx" ON "_site_navigation_v" USING btree ("version_created_at");
  CREATE INDEX "_site_navigation_v_version_version__status_idx" ON "_site_navigation_v" USING btree ("version__status");
  CREATE INDEX "_site_navigation_v_created_at_idx" ON "_site_navigation_v" USING btree ("created_at");
  CREATE INDEX "_site_navigation_v_updated_at_idx" ON "_site_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_site_navigation_v_snapshot_idx" ON "_site_navigation_v" USING btree ("snapshot");
  CREATE INDEX "_site_navigation_v_published_locale_idx" ON "_site_navigation_v" USING btree ("published_locale");
  CREATE INDEX "_site_navigation_v_latest_idx" ON "_site_navigation_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_site_navigation_v_locales_locale_parent_id_unique" ON "_site_navigation_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_faq_sections_items_order_idx" ON "site_faq_sections_items" USING btree ("_order");
  CREATE INDEX "site_faq_sections_items_parent_id_idx" ON "site_faq_sections_items" USING btree ("_parent_id");
  CREATE INDEX "site_faq_sections_items_locale_idx" ON "site_faq_sections_items" USING btree ("_locale");
  CREATE INDEX "site_faq_sections_order_idx" ON "site_faq_sections" USING btree ("_order");
  CREATE INDEX "site_faq_sections_parent_id_idx" ON "site_faq_sections" USING btree ("_parent_id");
  CREATE INDEX "site_faq_sections_locale_idx" ON "site_faq_sections" USING btree ("_locale");
  CREATE UNIQUE INDEX "site_faq_site_idx" ON "site_faq" USING btree ("site_id");
  CREATE INDEX "site_faq_updated_at_idx" ON "site_faq" USING btree ("updated_at");
  CREATE INDEX "site_faq_created_at_idx" ON "site_faq" USING btree ("created_at");
  CREATE INDEX "site_faq__status_idx" ON "site_faq" USING btree ("_status");
  CREATE INDEX "_site_faq_v_version_sections_items_order_idx" ON "_site_faq_v_version_sections_items" USING btree ("_order");
  CREATE INDEX "_site_faq_v_version_sections_items_parent_id_idx" ON "_site_faq_v_version_sections_items" USING btree ("_parent_id");
  CREATE INDEX "_site_faq_v_version_sections_items_locale_idx" ON "_site_faq_v_version_sections_items" USING btree ("_locale");
  CREATE INDEX "_site_faq_v_version_sections_order_idx" ON "_site_faq_v_version_sections" USING btree ("_order");
  CREATE INDEX "_site_faq_v_version_sections_parent_id_idx" ON "_site_faq_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_site_faq_v_version_sections_locale_idx" ON "_site_faq_v_version_sections" USING btree ("_locale");
  CREATE INDEX "_site_faq_v_parent_idx" ON "_site_faq_v" USING btree ("parent_id");
  CREATE INDEX "_site_faq_v_version_version_site_idx" ON "_site_faq_v" USING btree ("version_site_id");
  CREATE INDEX "_site_faq_v_version_version_updated_at_idx" ON "_site_faq_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_faq_v_version_version_created_at_idx" ON "_site_faq_v" USING btree ("version_created_at");
  CREATE INDEX "_site_faq_v_version_version__status_idx" ON "_site_faq_v" USING btree ("version__status");
  CREATE INDEX "_site_faq_v_created_at_idx" ON "_site_faq_v" USING btree ("created_at");
  CREATE INDEX "_site_faq_v_updated_at_idx" ON "_site_faq_v" USING btree ("updated_at");
  CREATE INDEX "_site_faq_v_snapshot_idx" ON "_site_faq_v" USING btree ("snapshot");
  CREATE INDEX "_site_faq_v_published_locale_idx" ON "_site_faq_v" USING btree ("published_locale");
  CREATE INDEX "_site_faq_v_latest_idx" ON "_site_faq_v" USING btree ("latest");
  CREATE INDEX "site_instruments_items_order_idx" ON "site_instruments_items" USING btree ("_order");
  CREATE INDEX "site_instruments_items_parent_id_idx" ON "site_instruments_items" USING btree ("_parent_id");
  CREATE INDEX "site_instruments_items_locale_idx" ON "site_instruments_items" USING btree ("_locale");
  CREATE INDEX "site_instruments_items_icon_idx" ON "site_instruments_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "site_instruments_site_idx" ON "site_instruments" USING btree ("site_id");
  CREATE INDEX "site_instruments_updated_at_idx" ON "site_instruments" USING btree ("updated_at");
  CREATE INDEX "site_instruments_created_at_idx" ON "site_instruments" USING btree ("created_at");
  CREATE INDEX "site_instruments__status_idx" ON "site_instruments" USING btree ("_status");
  CREATE INDEX "_site_instruments_v_version_items_order_idx" ON "_site_instruments_v_version_items" USING btree ("_order");
  CREATE INDEX "_site_instruments_v_version_items_parent_id_idx" ON "_site_instruments_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_site_instruments_v_version_items_locale_idx" ON "_site_instruments_v_version_items" USING btree ("_locale");
  CREATE INDEX "_site_instruments_v_version_items_icon_idx" ON "_site_instruments_v_version_items" USING btree ("icon_id");
  CREATE INDEX "_site_instruments_v_parent_idx" ON "_site_instruments_v" USING btree ("parent_id");
  CREATE INDEX "_site_instruments_v_version_version_site_idx" ON "_site_instruments_v" USING btree ("version_site_id");
  CREATE INDEX "_site_instruments_v_version_version_updated_at_idx" ON "_site_instruments_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_instruments_v_version_version_created_at_idx" ON "_site_instruments_v" USING btree ("version_created_at");
  CREATE INDEX "_site_instruments_v_version_version__status_idx" ON "_site_instruments_v" USING btree ("version__status");
  CREATE INDEX "_site_instruments_v_created_at_idx" ON "_site_instruments_v" USING btree ("created_at");
  CREATE INDEX "_site_instruments_v_updated_at_idx" ON "_site_instruments_v" USING btree ("updated_at");
  CREATE INDEX "_site_instruments_v_snapshot_idx" ON "_site_instruments_v" USING btree ("snapshot");
  CREATE INDEX "_site_instruments_v_published_locale_idx" ON "_site_instruments_v" USING btree ("published_locale");
  CREATE INDEX "_site_instruments_v_latest_idx" ON "_site_instruments_v" USING btree ("latest");
  CREATE INDEX "site_accounts_items_features_order_idx" ON "site_accounts_items_features" USING btree ("_order");
  CREATE INDEX "site_accounts_items_features_parent_id_idx" ON "site_accounts_items_features" USING btree ("_parent_id");
  CREATE INDEX "site_accounts_items_features_locale_idx" ON "site_accounts_items_features" USING btree ("_locale");
  CREATE INDEX "site_accounts_items_order_idx" ON "site_accounts_items" USING btree ("_order");
  CREATE INDEX "site_accounts_items_parent_id_idx" ON "site_accounts_items" USING btree ("_parent_id");
  CREATE INDEX "site_accounts_items_locale_idx" ON "site_accounts_items" USING btree ("_locale");
  CREATE UNIQUE INDEX "site_accounts_site_idx" ON "site_accounts" USING btree ("site_id");
  CREATE INDEX "site_accounts_updated_at_idx" ON "site_accounts" USING btree ("updated_at");
  CREATE INDEX "site_accounts_created_at_idx" ON "site_accounts" USING btree ("created_at");
  CREATE INDEX "site_accounts__status_idx" ON "site_accounts" USING btree ("_status");
  CREATE INDEX "_site_accounts_v_version_items_features_order_idx" ON "_site_accounts_v_version_items_features" USING btree ("_order");
  CREATE INDEX "_site_accounts_v_version_items_features_parent_id_idx" ON "_site_accounts_v_version_items_features" USING btree ("_parent_id");
  CREATE INDEX "_site_accounts_v_version_items_features_locale_idx" ON "_site_accounts_v_version_items_features" USING btree ("_locale");
  CREATE INDEX "_site_accounts_v_version_items_order_idx" ON "_site_accounts_v_version_items" USING btree ("_order");
  CREATE INDEX "_site_accounts_v_version_items_parent_id_idx" ON "_site_accounts_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_site_accounts_v_version_items_locale_idx" ON "_site_accounts_v_version_items" USING btree ("_locale");
  CREATE INDEX "_site_accounts_v_parent_idx" ON "_site_accounts_v" USING btree ("parent_id");
  CREATE INDEX "_site_accounts_v_version_version_site_idx" ON "_site_accounts_v" USING btree ("version_site_id");
  CREATE INDEX "_site_accounts_v_version_version_updated_at_idx" ON "_site_accounts_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_accounts_v_version_version_created_at_idx" ON "_site_accounts_v" USING btree ("version_created_at");
  CREATE INDEX "_site_accounts_v_version_version__status_idx" ON "_site_accounts_v" USING btree ("version__status");
  CREATE INDEX "_site_accounts_v_created_at_idx" ON "_site_accounts_v" USING btree ("created_at");
  CREATE INDEX "_site_accounts_v_updated_at_idx" ON "_site_accounts_v" USING btree ("updated_at");
  CREATE INDEX "_site_accounts_v_snapshot_idx" ON "_site_accounts_v" USING btree ("snapshot");
  CREATE INDEX "_site_accounts_v_published_locale_idx" ON "_site_accounts_v" USING btree ("published_locale");
  CREATE INDEX "_site_accounts_v_latest_idx" ON "_site_accounts_v" USING btree ("latest");
  CREATE INDEX "site_promotions_items_order_idx" ON "site_promotions_items" USING btree ("_order");
  CREATE INDEX "site_promotions_items_parent_id_idx" ON "site_promotions_items" USING btree ("_parent_id");
  CREATE INDEX "site_promotions_items_locale_idx" ON "site_promotions_items" USING btree ("_locale");
  CREATE UNIQUE INDEX "site_promotions_site_idx" ON "site_promotions" USING btree ("site_id");
  CREATE INDEX "site_promotions_updated_at_idx" ON "site_promotions" USING btree ("updated_at");
  CREATE INDEX "site_promotions_created_at_idx" ON "site_promotions" USING btree ("created_at");
  CREATE INDEX "site_promotions__status_idx" ON "site_promotions" USING btree ("_status");
  CREATE INDEX "_site_promotions_v_version_items_order_idx" ON "_site_promotions_v_version_items" USING btree ("_order");
  CREATE INDEX "_site_promotions_v_version_items_parent_id_idx" ON "_site_promotions_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_site_promotions_v_version_items_locale_idx" ON "_site_promotions_v_version_items" USING btree ("_locale");
  CREATE INDEX "_site_promotions_v_parent_idx" ON "_site_promotions_v" USING btree ("parent_id");
  CREATE INDEX "_site_promotions_v_version_version_site_idx" ON "_site_promotions_v" USING btree ("version_site_id");
  CREATE INDEX "_site_promotions_v_version_version_updated_at_idx" ON "_site_promotions_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_promotions_v_version_version_created_at_idx" ON "_site_promotions_v" USING btree ("version_created_at");
  CREATE INDEX "_site_promotions_v_version_version__status_idx" ON "_site_promotions_v" USING btree ("version__status");
  CREATE INDEX "_site_promotions_v_created_at_idx" ON "_site_promotions_v" USING btree ("created_at");
  CREATE INDEX "_site_promotions_v_updated_at_idx" ON "_site_promotions_v" USING btree ("updated_at");
  CREATE INDEX "_site_promotions_v_snapshot_idx" ON "_site_promotions_v" USING btree ("snapshot");
  CREATE INDEX "_site_promotions_v_published_locale_idx" ON "_site_promotions_v" USING btree ("published_locale");
  CREATE INDEX "_site_promotions_v_latest_idx" ON "_site_promotions_v" USING btree ("latest");
  CREATE INDEX "site_partners_models_features_order_idx" ON "site_partners_models_features" USING btree ("_order");
  CREATE INDEX "site_partners_models_features_parent_id_idx" ON "site_partners_models_features" USING btree ("_parent_id");
  CREATE INDEX "site_partners_models_features_locale_idx" ON "site_partners_models_features" USING btree ("_locale");
  CREATE INDEX "site_partners_models_order_idx" ON "site_partners_models" USING btree ("_order");
  CREATE INDEX "site_partners_models_parent_id_idx" ON "site_partners_models" USING btree ("_parent_id");
  CREATE INDEX "site_partners_models_locale_idx" ON "site_partners_models" USING btree ("_locale");
  CREATE INDEX "site_partners_tiers_order_idx" ON "site_partners_tiers" USING btree ("_order");
  CREATE INDEX "site_partners_tiers_parent_id_idx" ON "site_partners_tiers" USING btree ("_parent_id");
  CREATE INDEX "site_partners_tiers_locale_idx" ON "site_partners_tiers" USING btree ("_locale");
  CREATE INDEX "site_partners_steps_order_idx" ON "site_partners_steps" USING btree ("_order");
  CREATE INDEX "site_partners_steps_parent_id_idx" ON "site_partners_steps" USING btree ("_parent_id");
  CREATE INDEX "site_partners_steps_locale_idx" ON "site_partners_steps" USING btree ("_locale");
  CREATE UNIQUE INDEX "site_partners_site_idx" ON "site_partners" USING btree ("site_id");
  CREATE INDEX "site_partners_updated_at_idx" ON "site_partners" USING btree ("updated_at");
  CREATE INDEX "site_partners_created_at_idx" ON "site_partners" USING btree ("created_at");
  CREATE INDEX "site_partners__status_idx" ON "site_partners" USING btree ("_status");
  CREATE INDEX "_site_partners_v_version_models_features_order_idx" ON "_site_partners_v_version_models_features" USING btree ("_order");
  CREATE INDEX "_site_partners_v_version_models_features_parent_id_idx" ON "_site_partners_v_version_models_features" USING btree ("_parent_id");
  CREATE INDEX "_site_partners_v_version_models_features_locale_idx" ON "_site_partners_v_version_models_features" USING btree ("_locale");
  CREATE INDEX "_site_partners_v_version_models_order_idx" ON "_site_partners_v_version_models" USING btree ("_order");
  CREATE INDEX "_site_partners_v_version_models_parent_id_idx" ON "_site_partners_v_version_models" USING btree ("_parent_id");
  CREATE INDEX "_site_partners_v_version_models_locale_idx" ON "_site_partners_v_version_models" USING btree ("_locale");
  CREATE INDEX "_site_partners_v_version_tiers_order_idx" ON "_site_partners_v_version_tiers" USING btree ("_order");
  CREATE INDEX "_site_partners_v_version_tiers_parent_id_idx" ON "_site_partners_v_version_tiers" USING btree ("_parent_id");
  CREATE INDEX "_site_partners_v_version_tiers_locale_idx" ON "_site_partners_v_version_tiers" USING btree ("_locale");
  CREATE INDEX "_site_partners_v_version_steps_order_idx" ON "_site_partners_v_version_steps" USING btree ("_order");
  CREATE INDEX "_site_partners_v_version_steps_parent_id_idx" ON "_site_partners_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_site_partners_v_version_steps_locale_idx" ON "_site_partners_v_version_steps" USING btree ("_locale");
  CREATE INDEX "_site_partners_v_parent_idx" ON "_site_partners_v" USING btree ("parent_id");
  CREATE INDEX "_site_partners_v_version_version_site_idx" ON "_site_partners_v" USING btree ("version_site_id");
  CREATE INDEX "_site_partners_v_version_version_updated_at_idx" ON "_site_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_partners_v_version_version_created_at_idx" ON "_site_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_site_partners_v_version_version__status_idx" ON "_site_partners_v" USING btree ("version__status");
  CREATE INDEX "_site_partners_v_created_at_idx" ON "_site_partners_v" USING btree ("created_at");
  CREATE INDEX "_site_partners_v_updated_at_idx" ON "_site_partners_v" USING btree ("updated_at");
  CREATE INDEX "_site_partners_v_snapshot_idx" ON "_site_partners_v" USING btree ("snapshot");
  CREATE INDEX "_site_partners_v_published_locale_idx" ON "_site_partners_v" USING btree ("published_locale");
  CREATE INDEX "_site_partners_v_latest_idx" ON "_site_partners_v" USING btree ("latest");
  CREATE INDEX "site_academy_articles_order_idx" ON "site_academy_articles" USING btree ("_order");
  CREATE INDEX "site_academy_articles_parent_id_idx" ON "site_academy_articles" USING btree ("_parent_id");
  CREATE INDEX "site_academy_articles_locale_idx" ON "site_academy_articles" USING btree ("_locale");
  CREATE INDEX "site_academy_webinars_order_idx" ON "site_academy_webinars" USING btree ("_order");
  CREATE INDEX "site_academy_webinars_parent_id_idx" ON "site_academy_webinars" USING btree ("_parent_id");
  CREATE INDEX "site_academy_webinars_locale_idx" ON "site_academy_webinars" USING btree ("_locale");
  CREATE INDEX "site_academy_glossary_order_idx" ON "site_academy_glossary" USING btree ("_order");
  CREATE INDEX "site_academy_glossary_parent_id_idx" ON "site_academy_glossary" USING btree ("_parent_id");
  CREATE INDEX "site_academy_glossary_locale_idx" ON "site_academy_glossary" USING btree ("_locale");
  CREATE UNIQUE INDEX "site_academy_site_idx" ON "site_academy" USING btree ("site_id");
  CREATE INDEX "site_academy_updated_at_idx" ON "site_academy" USING btree ("updated_at");
  CREATE INDEX "site_academy_created_at_idx" ON "site_academy" USING btree ("created_at");
  CREATE INDEX "site_academy__status_idx" ON "site_academy" USING btree ("_status");
  CREATE INDEX "_site_academy_v_version_articles_order_idx" ON "_site_academy_v_version_articles" USING btree ("_order");
  CREATE INDEX "_site_academy_v_version_articles_parent_id_idx" ON "_site_academy_v_version_articles" USING btree ("_parent_id");
  CREATE INDEX "_site_academy_v_version_articles_locale_idx" ON "_site_academy_v_version_articles" USING btree ("_locale");
  CREATE INDEX "_site_academy_v_version_webinars_order_idx" ON "_site_academy_v_version_webinars" USING btree ("_order");
  CREATE INDEX "_site_academy_v_version_webinars_parent_id_idx" ON "_site_academy_v_version_webinars" USING btree ("_parent_id");
  CREATE INDEX "_site_academy_v_version_webinars_locale_idx" ON "_site_academy_v_version_webinars" USING btree ("_locale");
  CREATE INDEX "_site_academy_v_version_glossary_order_idx" ON "_site_academy_v_version_glossary" USING btree ("_order");
  CREATE INDEX "_site_academy_v_version_glossary_parent_id_idx" ON "_site_academy_v_version_glossary" USING btree ("_parent_id");
  CREATE INDEX "_site_academy_v_version_glossary_locale_idx" ON "_site_academy_v_version_glossary" USING btree ("_locale");
  CREATE INDEX "_site_academy_v_parent_idx" ON "_site_academy_v" USING btree ("parent_id");
  CREATE INDEX "_site_academy_v_version_version_site_idx" ON "_site_academy_v" USING btree ("version_site_id");
  CREATE INDEX "_site_academy_v_version_version_updated_at_idx" ON "_site_academy_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_academy_v_version_version_created_at_idx" ON "_site_academy_v" USING btree ("version_created_at");
  CREATE INDEX "_site_academy_v_version_version__status_idx" ON "_site_academy_v" USING btree ("version__status");
  CREATE INDEX "_site_academy_v_created_at_idx" ON "_site_academy_v" USING btree ("created_at");
  CREATE INDEX "_site_academy_v_updated_at_idx" ON "_site_academy_v" USING btree ("updated_at");
  CREATE INDEX "_site_academy_v_snapshot_idx" ON "_site_academy_v" USING btree ("snapshot");
  CREATE INDEX "_site_academy_v_published_locale_idx" ON "_site_academy_v" USING btree ("published_locale");
  CREATE INDEX "_site_academy_v_latest_idx" ON "_site_academy_v" USING btree ("latest");
  CREATE INDEX "site_streams_items_order_idx" ON "site_streams_items" USING btree ("_order");
  CREATE INDEX "site_streams_items_parent_id_idx" ON "site_streams_items" USING btree ("_parent_id");
  CREATE INDEX "site_streams_items_locale_idx" ON "site_streams_items" USING btree ("_locale");
  CREATE INDEX "site_streams_items_poster_idx" ON "site_streams_items" USING btree ("poster_id");
  CREATE UNIQUE INDEX "site_streams_site_idx" ON "site_streams" USING btree ("site_id");
  CREATE INDEX "site_streams_updated_at_idx" ON "site_streams" USING btree ("updated_at");
  CREATE INDEX "site_streams_created_at_idx" ON "site_streams" USING btree ("created_at");
  CREATE INDEX "site_streams__status_idx" ON "site_streams" USING btree ("_status");
  CREATE INDEX "_site_streams_v_version_items_order_idx" ON "_site_streams_v_version_items" USING btree ("_order");
  CREATE INDEX "_site_streams_v_version_items_parent_id_idx" ON "_site_streams_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_site_streams_v_version_items_locale_idx" ON "_site_streams_v_version_items" USING btree ("_locale");
  CREATE INDEX "_site_streams_v_version_items_poster_idx" ON "_site_streams_v_version_items" USING btree ("poster_id");
  CREATE INDEX "_site_streams_v_parent_idx" ON "_site_streams_v" USING btree ("parent_id");
  CREATE INDEX "_site_streams_v_version_version_site_idx" ON "_site_streams_v" USING btree ("version_site_id");
  CREATE INDEX "_site_streams_v_version_version_updated_at_idx" ON "_site_streams_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_streams_v_version_version_created_at_idx" ON "_site_streams_v" USING btree ("version_created_at");
  CREATE INDEX "_site_streams_v_version_version__status_idx" ON "_site_streams_v" USING btree ("version__status");
  CREATE INDEX "_site_streams_v_created_at_idx" ON "_site_streams_v" USING btree ("created_at");
  CREATE INDEX "_site_streams_v_updated_at_idx" ON "_site_streams_v" USING btree ("updated_at");
  CREATE INDEX "_site_streams_v_snapshot_idx" ON "_site_streams_v" USING btree ("snapshot");
  CREATE INDEX "_site_streams_v_published_locale_idx" ON "_site_streams_v" USING btree ("published_locale");
  CREATE INDEX "_site_streams_v_latest_idx" ON "_site_streams_v" USING btree ("latest");
  CREATE INDEX "site_contacts_channels_order_idx" ON "site_contacts_channels" USING btree ("_order");
  CREATE INDEX "site_contacts_channels_parent_id_idx" ON "site_contacts_channels" USING btree ("_parent_id");
  CREATE INDEX "site_contacts_channels_locale_idx" ON "site_contacts_channels" USING btree ("_locale");
  CREATE INDEX "site_contacts_offices_order_idx" ON "site_contacts_offices" USING btree ("_order");
  CREATE INDEX "site_contacts_offices_parent_id_idx" ON "site_contacts_offices" USING btree ("_parent_id");
  CREATE INDEX "site_contacts_offices_locale_idx" ON "site_contacts_offices" USING btree ("_locale");
  CREATE UNIQUE INDEX "site_contacts_site_idx" ON "site_contacts" USING btree ("site_id");
  CREATE INDEX "site_contacts_updated_at_idx" ON "site_contacts" USING btree ("updated_at");
  CREATE INDEX "site_contacts_created_at_idx" ON "site_contacts" USING btree ("created_at");
  CREATE INDEX "site_contacts__status_idx" ON "site_contacts" USING btree ("_status");
  CREATE INDEX "_site_contacts_v_version_channels_order_idx" ON "_site_contacts_v_version_channels" USING btree ("_order");
  CREATE INDEX "_site_contacts_v_version_channels_parent_id_idx" ON "_site_contacts_v_version_channels" USING btree ("_parent_id");
  CREATE INDEX "_site_contacts_v_version_channels_locale_idx" ON "_site_contacts_v_version_channels" USING btree ("_locale");
  CREATE INDEX "_site_contacts_v_version_offices_order_idx" ON "_site_contacts_v_version_offices" USING btree ("_order");
  CREATE INDEX "_site_contacts_v_version_offices_parent_id_idx" ON "_site_contacts_v_version_offices" USING btree ("_parent_id");
  CREATE INDEX "_site_contacts_v_version_offices_locale_idx" ON "_site_contacts_v_version_offices" USING btree ("_locale");
  CREATE INDEX "_site_contacts_v_parent_idx" ON "_site_contacts_v" USING btree ("parent_id");
  CREATE INDEX "_site_contacts_v_version_version_site_idx" ON "_site_contacts_v" USING btree ("version_site_id");
  CREATE INDEX "_site_contacts_v_version_version_updated_at_idx" ON "_site_contacts_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_contacts_v_version_version_created_at_idx" ON "_site_contacts_v" USING btree ("version_created_at");
  CREATE INDEX "_site_contacts_v_version_version__status_idx" ON "_site_contacts_v" USING btree ("version__status");
  CREATE INDEX "_site_contacts_v_created_at_idx" ON "_site_contacts_v" USING btree ("created_at");
  CREATE INDEX "_site_contacts_v_updated_at_idx" ON "_site_contacts_v" USING btree ("updated_at");
  CREATE INDEX "_site_contacts_v_snapshot_idx" ON "_site_contacts_v" USING btree ("snapshot");
  CREATE INDEX "_site_contacts_v_published_locale_idx" ON "_site_contacts_v" USING btree ("published_locale");
  CREATE INDEX "_site_contacts_v_latest_idx" ON "_site_contacts_v" USING btree ("latest");
  CREATE INDEX "site_careers_benefits_order_idx" ON "site_careers_benefits" USING btree ("_order");
  CREATE INDEX "site_careers_benefits_parent_id_idx" ON "site_careers_benefits" USING btree ("_parent_id");
  CREATE INDEX "site_careers_benefits_locale_idx" ON "site_careers_benefits" USING btree ("_locale");
  CREATE INDEX "site_careers_vacancies_order_idx" ON "site_careers_vacancies" USING btree ("_order");
  CREATE INDEX "site_careers_vacancies_parent_id_idx" ON "site_careers_vacancies" USING btree ("_parent_id");
  CREATE INDEX "site_careers_vacancies_locale_idx" ON "site_careers_vacancies" USING btree ("_locale");
  CREATE UNIQUE INDEX "site_careers_site_idx" ON "site_careers" USING btree ("site_id");
  CREATE INDEX "site_careers_updated_at_idx" ON "site_careers" USING btree ("updated_at");
  CREATE INDEX "site_careers_created_at_idx" ON "site_careers" USING btree ("created_at");
  CREATE INDEX "site_careers__status_idx" ON "site_careers" USING btree ("_status");
  CREATE INDEX "_site_careers_v_version_benefits_order_idx" ON "_site_careers_v_version_benefits" USING btree ("_order");
  CREATE INDEX "_site_careers_v_version_benefits_parent_id_idx" ON "_site_careers_v_version_benefits" USING btree ("_parent_id");
  CREATE INDEX "_site_careers_v_version_benefits_locale_idx" ON "_site_careers_v_version_benefits" USING btree ("_locale");
  CREATE INDEX "_site_careers_v_version_vacancies_order_idx" ON "_site_careers_v_version_vacancies" USING btree ("_order");
  CREATE INDEX "_site_careers_v_version_vacancies_parent_id_idx" ON "_site_careers_v_version_vacancies" USING btree ("_parent_id");
  CREATE INDEX "_site_careers_v_version_vacancies_locale_idx" ON "_site_careers_v_version_vacancies" USING btree ("_locale");
  CREATE INDEX "_site_careers_v_parent_idx" ON "_site_careers_v" USING btree ("parent_id");
  CREATE INDEX "_site_careers_v_version_version_site_idx" ON "_site_careers_v" USING btree ("version_site_id");
  CREATE INDEX "_site_careers_v_version_version_updated_at_idx" ON "_site_careers_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_careers_v_version_version_created_at_idx" ON "_site_careers_v" USING btree ("version_created_at");
  CREATE INDEX "_site_careers_v_version_version__status_idx" ON "_site_careers_v" USING btree ("version__status");
  CREATE INDEX "_site_careers_v_created_at_idx" ON "_site_careers_v" USING btree ("created_at");
  CREATE INDEX "_site_careers_v_updated_at_idx" ON "_site_careers_v" USING btree ("updated_at");
  CREATE INDEX "_site_careers_v_snapshot_idx" ON "_site_careers_v" USING btree ("snapshot");
  CREATE INDEX "_site_careers_v_published_locale_idx" ON "_site_careers_v" USING btree ("published_locale");
  CREATE INDEX "_site_careers_v_latest_idx" ON "_site_careers_v" USING btree ("latest");
  CREATE INDEX "site_legal_items_sections_paragraphs_markdown_order_idx" ON "site_legal_items_sections_paragraphs_markdown" USING btree ("_order");
  CREATE INDEX "site_legal_items_sections_paragraphs_markdown_parent_id_idx" ON "site_legal_items_sections_paragraphs_markdown" USING btree ("_parent_id");
  CREATE INDEX "site_legal_items_sections_paragraphs_markdown_locale_idx" ON "site_legal_items_sections_paragraphs_markdown" USING btree ("_locale");
  CREATE INDEX "site_legal_items_sections_order_idx" ON "site_legal_items_sections" USING btree ("_order");
  CREATE INDEX "site_legal_items_sections_parent_id_idx" ON "site_legal_items_sections" USING btree ("_parent_id");
  CREATE INDEX "site_legal_items_sections_locale_idx" ON "site_legal_items_sections" USING btree ("_locale");
  CREATE INDEX "site_legal_items_order_idx" ON "site_legal_items" USING btree ("_order");
  CREATE INDEX "site_legal_items_parent_id_idx" ON "site_legal_items" USING btree ("_parent_id");
  CREATE INDEX "site_legal_items_locale_idx" ON "site_legal_items" USING btree ("_locale");
  CREATE UNIQUE INDEX "site_legal_site_idx" ON "site_legal" USING btree ("site_id");
  CREATE INDEX "site_legal_updated_at_idx" ON "site_legal" USING btree ("updated_at");
  CREATE INDEX "site_legal_created_at_idx" ON "site_legal" USING btree ("created_at");
  CREATE INDEX "site_legal__status_idx" ON "site_legal" USING btree ("_status");
  CREATE INDEX "_site_legal_v_version_items_sections_paragraphs_markdown_order_idx" ON "_site_legal_v_version_items_sections_paragraphs_markdown" USING btree ("_order");
  CREATE INDEX "_site_legal_v_version_items_sections_paragraphs_markdown_parent_id_idx" ON "_site_legal_v_version_items_sections_paragraphs_markdown" USING btree ("_parent_id");
  CREATE INDEX "_site_legal_v_version_items_sections_paragraphs_markdown_locale_idx" ON "_site_legal_v_version_items_sections_paragraphs_markdown" USING btree ("_locale");
  CREATE INDEX "_site_legal_v_version_items_sections_order_idx" ON "_site_legal_v_version_items_sections" USING btree ("_order");
  CREATE INDEX "_site_legal_v_version_items_sections_parent_id_idx" ON "_site_legal_v_version_items_sections" USING btree ("_parent_id");
  CREATE INDEX "_site_legal_v_version_items_sections_locale_idx" ON "_site_legal_v_version_items_sections" USING btree ("_locale");
  CREATE INDEX "_site_legal_v_version_items_order_idx" ON "_site_legal_v_version_items" USING btree ("_order");
  CREATE INDEX "_site_legal_v_version_items_parent_id_idx" ON "_site_legal_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_site_legal_v_version_items_locale_idx" ON "_site_legal_v_version_items" USING btree ("_locale");
  CREATE INDEX "_site_legal_v_parent_idx" ON "_site_legal_v" USING btree ("parent_id");
  CREATE INDEX "_site_legal_v_version_version_site_idx" ON "_site_legal_v" USING btree ("version_site_id");
  CREATE INDEX "_site_legal_v_version_version_updated_at_idx" ON "_site_legal_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_legal_v_version_version_created_at_idx" ON "_site_legal_v" USING btree ("version_created_at");
  CREATE INDEX "_site_legal_v_version_version__status_idx" ON "_site_legal_v" USING btree ("version__status");
  CREATE INDEX "_site_legal_v_created_at_idx" ON "_site_legal_v" USING btree ("created_at");
  CREATE INDEX "_site_legal_v_updated_at_idx" ON "_site_legal_v" USING btree ("updated_at");
  CREATE INDEX "_site_legal_v_snapshot_idx" ON "_site_legal_v" USING btree ("snapshot");
  CREATE INDEX "_site_legal_v_published_locale_idx" ON "_site_legal_v" USING btree ("published_locale");
  CREATE INDEX "_site_legal_v_latest_idx" ON "_site_legal_v" USING btree ("latest");
  CREATE INDEX "site_system_status_services_order_idx" ON "site_system_status_services" USING btree ("_order");
  CREATE INDEX "site_system_status_services_parent_id_idx" ON "site_system_status_services" USING btree ("_parent_id");
  CREATE INDEX "site_system_status_services_locale_idx" ON "site_system_status_services" USING btree ("_locale");
  CREATE INDEX "site_system_status_incidents_order_idx" ON "site_system_status_incidents" USING btree ("_order");
  CREATE INDEX "site_system_status_incidents_parent_id_idx" ON "site_system_status_incidents" USING btree ("_parent_id");
  CREATE INDEX "site_system_status_incidents_locale_idx" ON "site_system_status_incidents" USING btree ("_locale");
  CREATE UNIQUE INDEX "site_system_status_site_idx" ON "site_system_status" USING btree ("site_id");
  CREATE INDEX "site_system_status_updated_at_idx" ON "site_system_status" USING btree ("updated_at");
  CREATE INDEX "site_system_status_created_at_idx" ON "site_system_status" USING btree ("created_at");
  CREATE INDEX "site_system_status__status_idx" ON "site_system_status" USING btree ("_status");
  CREATE INDEX "_site_system_status_v_version_services_order_idx" ON "_site_system_status_v_version_services" USING btree ("_order");
  CREATE INDEX "_site_system_status_v_version_services_parent_id_idx" ON "_site_system_status_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_site_system_status_v_version_services_locale_idx" ON "_site_system_status_v_version_services" USING btree ("_locale");
  CREATE INDEX "_site_system_status_v_version_incidents_order_idx" ON "_site_system_status_v_version_incidents" USING btree ("_order");
  CREATE INDEX "_site_system_status_v_version_incidents_parent_id_idx" ON "_site_system_status_v_version_incidents" USING btree ("_parent_id");
  CREATE INDEX "_site_system_status_v_version_incidents_locale_idx" ON "_site_system_status_v_version_incidents" USING btree ("_locale");
  CREATE INDEX "_site_system_status_v_parent_idx" ON "_site_system_status_v" USING btree ("parent_id");
  CREATE INDEX "_site_system_status_v_version_version_site_idx" ON "_site_system_status_v" USING btree ("version_site_id");
  CREATE INDEX "_site_system_status_v_version_version_updated_at_idx" ON "_site_system_status_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_system_status_v_version_version_created_at_idx" ON "_site_system_status_v" USING btree ("version_created_at");
  CREATE INDEX "_site_system_status_v_version_version__status_idx" ON "_site_system_status_v" USING btree ("version__status");
  CREATE INDEX "_site_system_status_v_created_at_idx" ON "_site_system_status_v" USING btree ("created_at");
  CREATE INDEX "_site_system_status_v_updated_at_idx" ON "_site_system_status_v" USING btree ("updated_at");
  CREATE INDEX "_site_system_status_v_snapshot_idx" ON "_site_system_status_v" USING btree ("snapshot");
  CREATE INDEX "_site_system_status_v_published_locale_idx" ON "_site_system_status_v" USING btree ("published_locale");
  CREATE INDEX "_site_system_status_v_latest_idx" ON "_site_system_status_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_sites_id_idx" ON "payload_locked_documents_rels" USING btree ("sites_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_site_navigation_id_idx" ON "payload_locked_documents_rels" USING btree ("site_navigation_id");
  CREATE INDEX "payload_locked_documents_rels_site_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("site_faq_id");
  CREATE INDEX "payload_locked_documents_rels_site_instruments_id_idx" ON "payload_locked_documents_rels" USING btree ("site_instruments_id");
  CREATE INDEX "payload_locked_documents_rels_site_accounts_id_idx" ON "payload_locked_documents_rels" USING btree ("site_accounts_id");
  CREATE INDEX "payload_locked_documents_rels_site_promotions_id_idx" ON "payload_locked_documents_rels" USING btree ("site_promotions_id");
  CREATE INDEX "payload_locked_documents_rels_site_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("site_partners_id");
  CREATE INDEX "payload_locked_documents_rels_site_academy_id_idx" ON "payload_locked_documents_rels" USING btree ("site_academy_id");
  CREATE INDEX "payload_locked_documents_rels_site_streams_id_idx" ON "payload_locked_documents_rels" USING btree ("site_streams_id");
  CREATE INDEX "payload_locked_documents_rels_site_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("site_contacts_id");
  CREATE INDEX "payload_locked_documents_rels_site_careers_id_idx" ON "payload_locked_documents_rels" USING btree ("site_careers_id");
  CREATE INDEX "payload_locked_documents_rels_site_legal_id_idx" ON "payload_locked_documents_rels" USING btree ("site_legal_id");
  CREATE INDEX "payload_locked_documents_rels_site_system_status_id_idx" ON "payload_locked_documents_rels" USING btree ("site_system_status_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "sites_socials" CASCADE;
  DROP TABLE "sites" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "site_navigation_header" CASCADE;
  DROP TABLE "site_navigation_footer_columns_links" CASCADE;
  DROP TABLE "site_navigation_footer_columns" CASCADE;
  DROP TABLE "site_navigation" CASCADE;
  DROP TABLE "site_navigation_locales" CASCADE;
  DROP TABLE "_site_navigation_v_version_header" CASCADE;
  DROP TABLE "_site_navigation_v_version_footer_columns_links" CASCADE;
  DROP TABLE "_site_navigation_v_version_footer_columns" CASCADE;
  DROP TABLE "_site_navigation_v" CASCADE;
  DROP TABLE "_site_navigation_v_locales" CASCADE;
  DROP TABLE "site_faq_sections_items" CASCADE;
  DROP TABLE "site_faq_sections" CASCADE;
  DROP TABLE "site_faq" CASCADE;
  DROP TABLE "_site_faq_v_version_sections_items" CASCADE;
  DROP TABLE "_site_faq_v_version_sections" CASCADE;
  DROP TABLE "_site_faq_v" CASCADE;
  DROP TABLE "site_instruments_items" CASCADE;
  DROP TABLE "site_instruments" CASCADE;
  DROP TABLE "_site_instruments_v_version_items" CASCADE;
  DROP TABLE "_site_instruments_v" CASCADE;
  DROP TABLE "site_accounts_items_features" CASCADE;
  DROP TABLE "site_accounts_items" CASCADE;
  DROP TABLE "site_accounts" CASCADE;
  DROP TABLE "_site_accounts_v_version_items_features" CASCADE;
  DROP TABLE "_site_accounts_v_version_items" CASCADE;
  DROP TABLE "_site_accounts_v" CASCADE;
  DROP TABLE "site_promotions_items" CASCADE;
  DROP TABLE "site_promotions" CASCADE;
  DROP TABLE "_site_promotions_v_version_items" CASCADE;
  DROP TABLE "_site_promotions_v" CASCADE;
  DROP TABLE "site_partners_models_features" CASCADE;
  DROP TABLE "site_partners_models" CASCADE;
  DROP TABLE "site_partners_tiers" CASCADE;
  DROP TABLE "site_partners_steps" CASCADE;
  DROP TABLE "site_partners" CASCADE;
  DROP TABLE "_site_partners_v_version_models_features" CASCADE;
  DROP TABLE "_site_partners_v_version_models" CASCADE;
  DROP TABLE "_site_partners_v_version_tiers" CASCADE;
  DROP TABLE "_site_partners_v_version_steps" CASCADE;
  DROP TABLE "_site_partners_v" CASCADE;
  DROP TABLE "site_academy_articles" CASCADE;
  DROP TABLE "site_academy_webinars" CASCADE;
  DROP TABLE "site_academy_glossary" CASCADE;
  DROP TABLE "site_academy" CASCADE;
  DROP TABLE "_site_academy_v_version_articles" CASCADE;
  DROP TABLE "_site_academy_v_version_webinars" CASCADE;
  DROP TABLE "_site_academy_v_version_glossary" CASCADE;
  DROP TABLE "_site_academy_v" CASCADE;
  DROP TABLE "site_streams_items" CASCADE;
  DROP TABLE "site_streams" CASCADE;
  DROP TABLE "_site_streams_v_version_items" CASCADE;
  DROP TABLE "_site_streams_v" CASCADE;
  DROP TABLE "site_contacts_channels" CASCADE;
  DROP TABLE "site_contacts_offices" CASCADE;
  DROP TABLE "site_contacts" CASCADE;
  DROP TABLE "_site_contacts_v_version_channels" CASCADE;
  DROP TABLE "_site_contacts_v_version_offices" CASCADE;
  DROP TABLE "_site_contacts_v" CASCADE;
  DROP TABLE "site_careers_benefits" CASCADE;
  DROP TABLE "site_careers_vacancies" CASCADE;
  DROP TABLE "site_careers" CASCADE;
  DROP TABLE "_site_careers_v_version_benefits" CASCADE;
  DROP TABLE "_site_careers_v_version_vacancies" CASCADE;
  DROP TABLE "_site_careers_v" CASCADE;
  DROP TABLE "site_legal_items_sections_paragraphs_markdown" CASCADE;
  DROP TABLE "site_legal_items_sections" CASCADE;
  DROP TABLE "site_legal_items" CASCADE;
  DROP TABLE "site_legal" CASCADE;
  DROP TABLE "_site_legal_v_version_items_sections_paragraphs_markdown" CASCADE;
  DROP TABLE "_site_legal_v_version_items_sections" CASCADE;
  DROP TABLE "_site_legal_v_version_items" CASCADE;
  DROP TABLE "_site_legal_v" CASCADE;
  DROP TABLE "site_system_status_services" CASCADE;
  DROP TABLE "site_system_status_incidents" CASCADE;
  DROP TABLE "site_system_status" CASCADE;
  DROP TABLE "_site_system_status_v_version_services" CASCADE;
  DROP TABLE "_site_system_status_v_version_incidents" CASCADE;
  DROP TABLE "_site_system_status_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_published_locale";
  DROP TYPE "public"."enum_site_navigation_status";
  DROP TYPE "public"."enum__site_navigation_v_version_status";
  DROP TYPE "public"."enum__site_navigation_v_published_locale";
  DROP TYPE "public"."enum_site_faq_status";
  DROP TYPE "public"."enum__site_faq_v_version_status";
  DROP TYPE "public"."enum__site_faq_v_published_locale";
  DROP TYPE "public"."enum_site_instruments_items_category";
  DROP TYPE "public"."enum_site_instruments_status";
  DROP TYPE "public"."enum__site_instruments_v_version_items_category";
  DROP TYPE "public"."enum__site_instruments_v_version_status";
  DROP TYPE "public"."enum__site_instruments_v_published_locale";
  DROP TYPE "public"."enum_site_accounts_status";
  DROP TYPE "public"."enum__site_accounts_v_version_status";
  DROP TYPE "public"."enum__site_accounts_v_published_locale";
  DROP TYPE "public"."enum_site_promotions_status";
  DROP TYPE "public"."enum__site_promotions_v_version_status";
  DROP TYPE "public"."enum__site_promotions_v_published_locale";
  DROP TYPE "public"."enum_site_partners_status";
  DROP TYPE "public"."enum__site_partners_v_version_status";
  DROP TYPE "public"."enum__site_partners_v_published_locale";
  DROP TYPE "public"."enum_site_academy_articles_level";
  DROP TYPE "public"."enum_site_academy_status";
  DROP TYPE "public"."enum__site_academy_v_version_articles_level";
  DROP TYPE "public"."enum__site_academy_v_version_status";
  DROP TYPE "public"."enum__site_academy_v_published_locale";
  DROP TYPE "public"."enum_site_streams_items_provider";
  DROP TYPE "public"."enum_site_streams_items_status";
  DROP TYPE "public"."enum_site_streams_status";
  DROP TYPE "public"."enum__site_streams_v_version_items_provider";
  DROP TYPE "public"."enum__site_streams_v_version_items_status";
  DROP TYPE "public"."enum__site_streams_v_version_status";
  DROP TYPE "public"."enum__site_streams_v_published_locale";
  DROP TYPE "public"."enum_site_contacts_status";
  DROP TYPE "public"."enum__site_contacts_v_version_status";
  DROP TYPE "public"."enum__site_contacts_v_published_locale";
  DROP TYPE "public"."enum_site_careers_status";
  DROP TYPE "public"."enum__site_careers_v_version_status";
  DROP TYPE "public"."enum__site_careers_v_published_locale";
  DROP TYPE "public"."enum_site_legal_status";
  DROP TYPE "public"."enum__site_legal_v_version_status";
  DROP TYPE "public"."enum__site_legal_v_published_locale";
  DROP TYPE "public"."enum_site_system_status_services_status";
  DROP TYPE "public"."enum_site_system_status_status";
  DROP TYPE "public"."enum__site_system_status_v_version_services_status";
  DROP TYPE "public"."enum__site_system_status_v_version_status";
  DROP TYPE "public"."enum__site_system_status_v_published_locale";`)
}
