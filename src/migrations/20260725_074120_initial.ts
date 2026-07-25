import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_brand_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__brand_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__brand_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_navigation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_faq_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faq_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faq_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_instruments_items_category" AS ENUM('forex', 'metals', 'crypto', 'indices', 'stocks', 'energy');
  CREATE TYPE "public"."enum_instruments_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__instruments_v_version_items_category" AS ENUM('forex', 'metals', 'crypto', 'indices', 'stocks', 'energy');
  CREATE TYPE "public"."enum__instruments_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__instruments_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_accounts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__accounts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__accounts_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_promotions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__promotions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__promotions_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_academy_articles_level" AS ENUM('beginner', 'intermediate');
  CREATE TYPE "public"."enum_academy_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__academy_v_version_articles_level" AS ENUM('beginner', 'intermediate');
  CREATE TYPE "public"."enum__academy_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__academy_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_streams_items_provider" AS ENUM('youtube', 'vimeo');
  CREATE TYPE "public"."enum_streams_items_status" AS ENUM('live', 'upcoming', 'past');
  CREATE TYPE "public"."enum_streams_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__streams_v_version_items_provider" AS ENUM('youtube', 'vimeo');
  CREATE TYPE "public"."enum__streams_v_version_items_status" AS ENUM('live', 'upcoming', 'past');
  CREATE TYPE "public"."enum__streams_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__streams_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_contacts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contacts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contacts_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_careers_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__careers_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__careers_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_legal_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_system_status_services_status" AS ENUM('operational', 'degraded', 'outage', 'maintenance');
  CREATE TYPE "public"."enum_system_status_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__system_status_v_version_services_status" AS ENUM('operational', 'degraded', 'outage', 'maintenance');
  CREATE TYPE "public"."enum__system_status_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__system_status_v_published_locale" AS ENUM('ru', 'en');
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
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
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
  	"articles_id" integer
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
  
  CREATE TABLE "brand_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "brand" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"primary_color" varchar DEFAULT '#d4a437',
  	"_status" "enum_brand_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_brand_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_brand_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_name" varchar,
  	"version_logo_id" integer,
  	"version_favicon_id" integer,
  	"version_primary_color" varchar DEFAULT '#d4a437',
  	"version__status" "enum__brand_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__brand_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "navigation_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "navigation_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_navigation_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_locales" (
  	"risk_warning" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_navigation_v_version_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__navigation_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__navigation_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_navigation_v_locales" (
  	"version_risk_warning" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faq_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "faq_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_faq_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_faq_v_version_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_faq_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_faq_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__faq_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__faq_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "instruments_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"symbol" varchar,
  	"name" varchar,
  	"category" "enum_instruments_items_category",
  	"digits" numeric,
  	"leverage_max" varchar,
  	"spread_from" varchar,
  	"swap_free" boolean DEFAULT true,
  	"icon_id" integer
  );
  
  CREATE TABLE "instruments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_instruments_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_instruments_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"symbol" varchar,
  	"name" varchar,
  	"category" "enum__instruments_v_version_items_category",
  	"digits" numeric,
  	"leverage_max" varchar,
  	"spread_from" varchar,
  	"swap_free" boolean DEFAULT true,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_instruments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__instruments_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__instruments_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "accounts_items_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "accounts_items" (
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
  
  CREATE TABLE "accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_accounts_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_accounts_v_version_items_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_accounts_v_version_items" (
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
  
  CREATE TABLE "_accounts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__accounts_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__accounts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "promotions_items" (
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
  
  CREATE TABLE "promotions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_promotions_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_promotions_v_version_items" (
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
  
  CREATE TABLE "_promotions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__promotions_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__promotions_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "partners_models_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "partners_models" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "partners_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"clients" varchar,
  	"share" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "partners_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_partners_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_partners_v_version_models_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_partners_v_version_models" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_partners_v_version_tiers" (
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
  
  CREATE TABLE "_partners_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_partners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__partners_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__partners_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "academy_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"excerpt" varchar,
  	"level" "enum_academy_articles_level",
  	"reading_minutes" numeric,
  	"body_markdown" varchar
  );
  
  CREATE TABLE "academy_webinars" (
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
  
  CREATE TABLE "academy_glossary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"definition" varchar
  );
  
  CREATE TABLE "academy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_academy_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_academy_v_version_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"excerpt" varchar,
  	"level" "enum__academy_v_version_articles_level",
  	"reading_minutes" numeric,
  	"body_markdown" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_academy_v_version_webinars" (
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
  
  CREATE TABLE "_academy_v_version_glossary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"definition" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_academy_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__academy_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__academy_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "streams_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"provider" "enum_streams_items_provider" DEFAULT 'youtube',
  	"video_id" varchar,
  	"title" varchar,
  	"poster_id" integer,
  	"starts_at" timestamp(3) with time zone,
  	"status" "enum_streams_items_status"
  );
  
  CREATE TABLE "streams" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_streams_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_streams_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider" "enum__streams_v_version_items_provider" DEFAULT 'youtube',
  	"video_id" varchar,
  	"title" varchar,
  	"poster_id" integer,
  	"starts_at" timestamp(3) with time zone,
  	"status" "enum__streams_v_version_items_status",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_streams_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__streams_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__streams_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "contacts_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"value" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "contacts_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" varchar,
  	"country" varchar,
  	"address" varchar
  );
  
  CREATE TABLE "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_contacts_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contacts_v_version_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"value" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v_version_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"city" varchar,
  	"country" varchar,
  	"address" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__contacts_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__contacts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "careers_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "careers_vacancies" (
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
  
  CREATE TABLE "careers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_careers_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_careers_v_version_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_careers_v_version_vacancies" (
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
  
  CREATE TABLE "_careers_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__careers_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__careers_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "legal_items_sections_paragraphs_markdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "legal_items_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "legal_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"updated_at" varchar,
  	"intro" varchar
  );
  
  CREATE TABLE "legal" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_legal_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_legal_v_version_items_sections_paragraphs_markdown" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_legal_v_version_items_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_legal_v_version_items" (
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
  
  CREATE TABLE "_legal_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__legal_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__legal_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "system_status_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_id" varchar,
  	"name" varchar,
  	"description" varchar,
  	"status" "enum_system_status_services_status" DEFAULT 'operational',
  	"uptime90d" varchar
  );
  
  CREATE TABLE "system_status_incidents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"status" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "system_status" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_system_status_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_system_status_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_id" varchar,
  	"name" varchar,
  	"description" varchar,
  	"status" "enum__system_status_v_version_services_status" DEFAULT 'operational',
  	"uptime90d" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_system_status_v_version_incidents" (
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
  
  CREATE TABLE "_system_status_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__system_status_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__system_status_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brand_socials" ADD CONSTRAINT "brand_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brand" ADD CONSTRAINT "brand_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brand" ADD CONSTRAINT "brand_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brand_v_version_socials" ADD CONSTRAINT "_brand_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_brand_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brand_v" ADD CONSTRAINT "_brand_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brand_v" ADD CONSTRAINT "_brand_v_version_favicon_id_media_id_fk" FOREIGN KEY ("version_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_locales" ADD CONSTRAINT "navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_header" ADD CONSTRAINT "_navigation_v_version_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_columns_links" ADD CONSTRAINT "_navigation_v_version_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_columns" ADD CONSTRAINT "_navigation_v_version_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_locales" ADD CONSTRAINT "_navigation_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_sections_items" ADD CONSTRAINT "faq_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_sections" ADD CONSTRAINT "faq_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faq_v_version_sections_items" ADD CONSTRAINT "_faq_v_version_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faq_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faq_v_version_sections" ADD CONSTRAINT "_faq_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faq_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "instruments_items" ADD CONSTRAINT "instruments_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "instruments_items" ADD CONSTRAINT "instruments_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."instruments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_instruments_v_version_items" ADD CONSTRAINT "_instruments_v_version_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_instruments_v_version_items" ADD CONSTRAINT "_instruments_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_instruments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accounts_items_features" ADD CONSTRAINT "accounts_items_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accounts_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accounts_items" ADD CONSTRAINT "accounts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accounts_v_version_items_features" ADD CONSTRAINT "_accounts_v_version_items_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accounts_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_accounts_v_version_items" ADD CONSTRAINT "_accounts_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_accounts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "promotions_items" ADD CONSTRAINT "promotions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_promotions_v_version_items" ADD CONSTRAINT "_promotions_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_promotions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_models_features" ADD CONSTRAINT "partners_models_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_models" ADD CONSTRAINT "partners_models_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_tiers" ADD CONSTRAINT "partners_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_steps" ADD CONSTRAINT "partners_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v_version_models_features" ADD CONSTRAINT "_partners_v_version_models_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partners_v_version_models"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v_version_models" ADD CONSTRAINT "_partners_v_version_models_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v_version_tiers" ADD CONSTRAINT "_partners_v_version_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v_version_steps" ADD CONSTRAINT "_partners_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academy_articles" ADD CONSTRAINT "academy_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academy_webinars" ADD CONSTRAINT "academy_webinars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academy_glossary" ADD CONSTRAINT "academy_glossary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_academy_v_version_articles" ADD CONSTRAINT "_academy_v_version_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_academy_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_academy_v_version_webinars" ADD CONSTRAINT "_academy_v_version_webinars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_academy_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_academy_v_version_glossary" ADD CONSTRAINT "_academy_v_version_glossary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_academy_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "streams_items" ADD CONSTRAINT "streams_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "streams_items" ADD CONSTRAINT "streams_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."streams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_streams_v_version_items" ADD CONSTRAINT "_streams_v_version_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_streams_v_version_items" ADD CONSTRAINT "_streams_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_streams_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_channels" ADD CONSTRAINT "contacts_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_offices" ADD CONSTRAINT "contacts_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_version_channels" ADD CONSTRAINT "_contacts_v_version_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_version_offices" ADD CONSTRAINT "_contacts_v_version_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_benefits" ADD CONSTRAINT "careers_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_vacancies" ADD CONSTRAINT "careers_vacancies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_v_version_benefits" ADD CONSTRAINT "_careers_v_version_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_v_version_vacancies" ADD CONSTRAINT "_careers_v_version_vacancies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_items_sections_paragraphs_markdown" ADD CONSTRAINT "legal_items_sections_paragraphs_markdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_items_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_items_sections" ADD CONSTRAINT "legal_items_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_items" ADD CONSTRAINT "legal_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_version_items_sections_paragraphs_markdown" ADD CONSTRAINT "_legal_v_version_items_sections_paragraphs_markdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v_version_items_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_version_items_sections" ADD CONSTRAINT "_legal_v_version_items_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_version_items" ADD CONSTRAINT "_legal_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "system_status_services" ADD CONSTRAINT "system_status_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."system_status"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "system_status_incidents" ADD CONSTRAINT "system_status_incidents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."system_status"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_system_status_v_version_services" ADD CONSTRAINT "_system_status_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_system_status_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_system_status_v_version_incidents" ADD CONSTRAINT "_system_status_v_version_incidents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_system_status_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
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
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "brand_socials_order_idx" ON "brand_socials" USING btree ("_order");
  CREATE INDEX "brand_socials_parent_id_idx" ON "brand_socials" USING btree ("_parent_id");
  CREATE INDEX "brand_logo_idx" ON "brand" USING btree ("logo_id");
  CREATE INDEX "brand_favicon_idx" ON "brand" USING btree ("favicon_id");
  CREATE INDEX "brand__status_idx" ON "brand" USING btree ("_status");
  CREATE INDEX "_brand_v_version_socials_order_idx" ON "_brand_v_version_socials" USING btree ("_order");
  CREATE INDEX "_brand_v_version_socials_parent_id_idx" ON "_brand_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_brand_v_version_version_logo_idx" ON "_brand_v" USING btree ("version_logo_id");
  CREATE INDEX "_brand_v_version_version_favicon_idx" ON "_brand_v" USING btree ("version_favicon_id");
  CREATE INDEX "_brand_v_version_version__status_idx" ON "_brand_v" USING btree ("version__status");
  CREATE INDEX "_brand_v_created_at_idx" ON "_brand_v" USING btree ("created_at");
  CREATE INDEX "_brand_v_updated_at_idx" ON "_brand_v" USING btree ("updated_at");
  CREATE INDEX "_brand_v_snapshot_idx" ON "_brand_v" USING btree ("snapshot");
  CREATE INDEX "_brand_v_published_locale_idx" ON "_brand_v" USING btree ("published_locale");
  CREATE INDEX "_brand_v_latest_idx" ON "_brand_v" USING btree ("latest");
  CREATE INDEX "_brand_v_autosave_idx" ON "_brand_v" USING btree ("autosave");
  CREATE INDEX "navigation_header_order_idx" ON "navigation_header" USING btree ("_order");
  CREATE INDEX "navigation_header_parent_id_idx" ON "navigation_header" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_locale_idx" ON "navigation_header" USING btree ("_locale");
  CREATE INDEX "navigation_footer_columns_links_order_idx" ON "navigation_footer_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_links_parent_id_idx" ON "navigation_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_links_locale_idx" ON "navigation_footer_columns_links" USING btree ("_locale");
  CREATE INDEX "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_locale_idx" ON "navigation_footer_columns" USING btree ("_locale");
  CREATE INDEX "navigation__status_idx" ON "navigation" USING btree ("_status");
  CREATE UNIQUE INDEX "navigation_locales_locale_parent_id_unique" ON "navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_navigation_v_version_header_order_idx" ON "_navigation_v_version_header" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_header_parent_id_idx" ON "_navigation_v_version_header" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_header_locale_idx" ON "_navigation_v_version_header" USING btree ("_locale");
  CREATE INDEX "_navigation_v_version_footer_columns_links_order_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_footer_columns_links_parent_id_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_footer_columns_links_locale_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("_locale");
  CREATE INDEX "_navigation_v_version_footer_columns_order_idx" ON "_navigation_v_version_footer_columns" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_footer_columns_parent_id_idx" ON "_navigation_v_version_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_footer_columns_locale_idx" ON "_navigation_v_version_footer_columns" USING btree ("_locale");
  CREATE INDEX "_navigation_v_version_version__status_idx" ON "_navigation_v" USING btree ("version__status");
  CREATE INDEX "_navigation_v_created_at_idx" ON "_navigation_v" USING btree ("created_at");
  CREATE INDEX "_navigation_v_updated_at_idx" ON "_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_navigation_v_snapshot_idx" ON "_navigation_v" USING btree ("snapshot");
  CREATE INDEX "_navigation_v_published_locale_idx" ON "_navigation_v" USING btree ("published_locale");
  CREATE INDEX "_navigation_v_latest_idx" ON "_navigation_v" USING btree ("latest");
  CREATE INDEX "_navigation_v_autosave_idx" ON "_navigation_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_navigation_v_locales_locale_parent_id_unique" ON "_navigation_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faq_sections_items_order_idx" ON "faq_sections_items" USING btree ("_order");
  CREATE INDEX "faq_sections_items_parent_id_idx" ON "faq_sections_items" USING btree ("_parent_id");
  CREATE INDEX "faq_sections_items_locale_idx" ON "faq_sections_items" USING btree ("_locale");
  CREATE INDEX "faq_sections_order_idx" ON "faq_sections" USING btree ("_order");
  CREATE INDEX "faq_sections_parent_id_idx" ON "faq_sections" USING btree ("_parent_id");
  CREATE INDEX "faq_sections_locale_idx" ON "faq_sections" USING btree ("_locale");
  CREATE INDEX "faq__status_idx" ON "faq" USING btree ("_status");
  CREATE INDEX "_faq_v_version_sections_items_order_idx" ON "_faq_v_version_sections_items" USING btree ("_order");
  CREATE INDEX "_faq_v_version_sections_items_parent_id_idx" ON "_faq_v_version_sections_items" USING btree ("_parent_id");
  CREATE INDEX "_faq_v_version_sections_items_locale_idx" ON "_faq_v_version_sections_items" USING btree ("_locale");
  CREATE INDEX "_faq_v_version_sections_order_idx" ON "_faq_v_version_sections" USING btree ("_order");
  CREATE INDEX "_faq_v_version_sections_parent_id_idx" ON "_faq_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_faq_v_version_sections_locale_idx" ON "_faq_v_version_sections" USING btree ("_locale");
  CREATE INDEX "_faq_v_version_version__status_idx" ON "_faq_v" USING btree ("version__status");
  CREATE INDEX "_faq_v_created_at_idx" ON "_faq_v" USING btree ("created_at");
  CREATE INDEX "_faq_v_updated_at_idx" ON "_faq_v" USING btree ("updated_at");
  CREATE INDEX "_faq_v_snapshot_idx" ON "_faq_v" USING btree ("snapshot");
  CREATE INDEX "_faq_v_published_locale_idx" ON "_faq_v" USING btree ("published_locale");
  CREATE INDEX "_faq_v_latest_idx" ON "_faq_v" USING btree ("latest");
  CREATE INDEX "_faq_v_autosave_idx" ON "_faq_v" USING btree ("autosave");
  CREATE INDEX "instruments_items_order_idx" ON "instruments_items" USING btree ("_order");
  CREATE INDEX "instruments_items_parent_id_idx" ON "instruments_items" USING btree ("_parent_id");
  CREATE INDEX "instruments_items_locale_idx" ON "instruments_items" USING btree ("_locale");
  CREATE INDEX "instruments_items_icon_idx" ON "instruments_items" USING btree ("icon_id");
  CREATE INDEX "instruments__status_idx" ON "instruments" USING btree ("_status");
  CREATE INDEX "_instruments_v_version_items_order_idx" ON "_instruments_v_version_items" USING btree ("_order");
  CREATE INDEX "_instruments_v_version_items_parent_id_idx" ON "_instruments_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_instruments_v_version_items_locale_idx" ON "_instruments_v_version_items" USING btree ("_locale");
  CREATE INDEX "_instruments_v_version_items_icon_idx" ON "_instruments_v_version_items" USING btree ("icon_id");
  CREATE INDEX "_instruments_v_version_version__status_idx" ON "_instruments_v" USING btree ("version__status");
  CREATE INDEX "_instruments_v_created_at_idx" ON "_instruments_v" USING btree ("created_at");
  CREATE INDEX "_instruments_v_updated_at_idx" ON "_instruments_v" USING btree ("updated_at");
  CREATE INDEX "_instruments_v_snapshot_idx" ON "_instruments_v" USING btree ("snapshot");
  CREATE INDEX "_instruments_v_published_locale_idx" ON "_instruments_v" USING btree ("published_locale");
  CREATE INDEX "_instruments_v_latest_idx" ON "_instruments_v" USING btree ("latest");
  CREATE INDEX "_instruments_v_autosave_idx" ON "_instruments_v" USING btree ("autosave");
  CREATE INDEX "accounts_items_features_order_idx" ON "accounts_items_features" USING btree ("_order");
  CREATE INDEX "accounts_items_features_parent_id_idx" ON "accounts_items_features" USING btree ("_parent_id");
  CREATE INDEX "accounts_items_features_locale_idx" ON "accounts_items_features" USING btree ("_locale");
  CREATE INDEX "accounts_items_order_idx" ON "accounts_items" USING btree ("_order");
  CREATE INDEX "accounts_items_parent_id_idx" ON "accounts_items" USING btree ("_parent_id");
  CREATE INDEX "accounts_items_locale_idx" ON "accounts_items" USING btree ("_locale");
  CREATE INDEX "accounts__status_idx" ON "accounts" USING btree ("_status");
  CREATE INDEX "_accounts_v_version_items_features_order_idx" ON "_accounts_v_version_items_features" USING btree ("_order");
  CREATE INDEX "_accounts_v_version_items_features_parent_id_idx" ON "_accounts_v_version_items_features" USING btree ("_parent_id");
  CREATE INDEX "_accounts_v_version_items_features_locale_idx" ON "_accounts_v_version_items_features" USING btree ("_locale");
  CREATE INDEX "_accounts_v_version_items_order_idx" ON "_accounts_v_version_items" USING btree ("_order");
  CREATE INDEX "_accounts_v_version_items_parent_id_idx" ON "_accounts_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_accounts_v_version_items_locale_idx" ON "_accounts_v_version_items" USING btree ("_locale");
  CREATE INDEX "_accounts_v_version_version__status_idx" ON "_accounts_v" USING btree ("version__status");
  CREATE INDEX "_accounts_v_created_at_idx" ON "_accounts_v" USING btree ("created_at");
  CREATE INDEX "_accounts_v_updated_at_idx" ON "_accounts_v" USING btree ("updated_at");
  CREATE INDEX "_accounts_v_snapshot_idx" ON "_accounts_v" USING btree ("snapshot");
  CREATE INDEX "_accounts_v_published_locale_idx" ON "_accounts_v" USING btree ("published_locale");
  CREATE INDEX "_accounts_v_latest_idx" ON "_accounts_v" USING btree ("latest");
  CREATE INDEX "_accounts_v_autosave_idx" ON "_accounts_v" USING btree ("autosave");
  CREATE INDEX "promotions_items_order_idx" ON "promotions_items" USING btree ("_order");
  CREATE INDEX "promotions_items_parent_id_idx" ON "promotions_items" USING btree ("_parent_id");
  CREATE INDEX "promotions_items_locale_idx" ON "promotions_items" USING btree ("_locale");
  CREATE INDEX "promotions__status_idx" ON "promotions" USING btree ("_status");
  CREATE INDEX "_promotions_v_version_items_order_idx" ON "_promotions_v_version_items" USING btree ("_order");
  CREATE INDEX "_promotions_v_version_items_parent_id_idx" ON "_promotions_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_promotions_v_version_items_locale_idx" ON "_promotions_v_version_items" USING btree ("_locale");
  CREATE INDEX "_promotions_v_version_version__status_idx" ON "_promotions_v" USING btree ("version__status");
  CREATE INDEX "_promotions_v_created_at_idx" ON "_promotions_v" USING btree ("created_at");
  CREATE INDEX "_promotions_v_updated_at_idx" ON "_promotions_v" USING btree ("updated_at");
  CREATE INDEX "_promotions_v_snapshot_idx" ON "_promotions_v" USING btree ("snapshot");
  CREATE INDEX "_promotions_v_published_locale_idx" ON "_promotions_v" USING btree ("published_locale");
  CREATE INDEX "_promotions_v_latest_idx" ON "_promotions_v" USING btree ("latest");
  CREATE INDEX "_promotions_v_autosave_idx" ON "_promotions_v" USING btree ("autosave");
  CREATE INDEX "partners_models_features_order_idx" ON "partners_models_features" USING btree ("_order");
  CREATE INDEX "partners_models_features_parent_id_idx" ON "partners_models_features" USING btree ("_parent_id");
  CREATE INDEX "partners_models_features_locale_idx" ON "partners_models_features" USING btree ("_locale");
  CREATE INDEX "partners_models_order_idx" ON "partners_models" USING btree ("_order");
  CREATE INDEX "partners_models_parent_id_idx" ON "partners_models" USING btree ("_parent_id");
  CREATE INDEX "partners_models_locale_idx" ON "partners_models" USING btree ("_locale");
  CREATE INDEX "partners_tiers_order_idx" ON "partners_tiers" USING btree ("_order");
  CREATE INDEX "partners_tiers_parent_id_idx" ON "partners_tiers" USING btree ("_parent_id");
  CREATE INDEX "partners_tiers_locale_idx" ON "partners_tiers" USING btree ("_locale");
  CREATE INDEX "partners_steps_order_idx" ON "partners_steps" USING btree ("_order");
  CREATE INDEX "partners_steps_parent_id_idx" ON "partners_steps" USING btree ("_parent_id");
  CREATE INDEX "partners_steps_locale_idx" ON "partners_steps" USING btree ("_locale");
  CREATE INDEX "partners__status_idx" ON "partners" USING btree ("_status");
  CREATE INDEX "_partners_v_version_models_features_order_idx" ON "_partners_v_version_models_features" USING btree ("_order");
  CREATE INDEX "_partners_v_version_models_features_parent_id_idx" ON "_partners_v_version_models_features" USING btree ("_parent_id");
  CREATE INDEX "_partners_v_version_models_features_locale_idx" ON "_partners_v_version_models_features" USING btree ("_locale");
  CREATE INDEX "_partners_v_version_models_order_idx" ON "_partners_v_version_models" USING btree ("_order");
  CREATE INDEX "_partners_v_version_models_parent_id_idx" ON "_partners_v_version_models" USING btree ("_parent_id");
  CREATE INDEX "_partners_v_version_models_locale_idx" ON "_partners_v_version_models" USING btree ("_locale");
  CREATE INDEX "_partners_v_version_tiers_order_idx" ON "_partners_v_version_tiers" USING btree ("_order");
  CREATE INDEX "_partners_v_version_tiers_parent_id_idx" ON "_partners_v_version_tiers" USING btree ("_parent_id");
  CREATE INDEX "_partners_v_version_tiers_locale_idx" ON "_partners_v_version_tiers" USING btree ("_locale");
  CREATE INDEX "_partners_v_version_steps_order_idx" ON "_partners_v_version_steps" USING btree ("_order");
  CREATE INDEX "_partners_v_version_steps_parent_id_idx" ON "_partners_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_partners_v_version_steps_locale_idx" ON "_partners_v_version_steps" USING btree ("_locale");
  CREATE INDEX "_partners_v_version_version__status_idx" ON "_partners_v" USING btree ("version__status");
  CREATE INDEX "_partners_v_created_at_idx" ON "_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_snapshot_idx" ON "_partners_v" USING btree ("snapshot");
  CREATE INDEX "_partners_v_published_locale_idx" ON "_partners_v" USING btree ("published_locale");
  CREATE INDEX "_partners_v_latest_idx" ON "_partners_v" USING btree ("latest");
  CREATE INDEX "_partners_v_autosave_idx" ON "_partners_v" USING btree ("autosave");
  CREATE INDEX "academy_articles_order_idx" ON "academy_articles" USING btree ("_order");
  CREATE INDEX "academy_articles_parent_id_idx" ON "academy_articles" USING btree ("_parent_id");
  CREATE INDEX "academy_articles_locale_idx" ON "academy_articles" USING btree ("_locale");
  CREATE INDEX "academy_webinars_order_idx" ON "academy_webinars" USING btree ("_order");
  CREATE INDEX "academy_webinars_parent_id_idx" ON "academy_webinars" USING btree ("_parent_id");
  CREATE INDEX "academy_webinars_locale_idx" ON "academy_webinars" USING btree ("_locale");
  CREATE INDEX "academy_glossary_order_idx" ON "academy_glossary" USING btree ("_order");
  CREATE INDEX "academy_glossary_parent_id_idx" ON "academy_glossary" USING btree ("_parent_id");
  CREATE INDEX "academy_glossary_locale_idx" ON "academy_glossary" USING btree ("_locale");
  CREATE INDEX "academy__status_idx" ON "academy" USING btree ("_status");
  CREATE INDEX "_academy_v_version_articles_order_idx" ON "_academy_v_version_articles" USING btree ("_order");
  CREATE INDEX "_academy_v_version_articles_parent_id_idx" ON "_academy_v_version_articles" USING btree ("_parent_id");
  CREATE INDEX "_academy_v_version_articles_locale_idx" ON "_academy_v_version_articles" USING btree ("_locale");
  CREATE INDEX "_academy_v_version_webinars_order_idx" ON "_academy_v_version_webinars" USING btree ("_order");
  CREATE INDEX "_academy_v_version_webinars_parent_id_idx" ON "_academy_v_version_webinars" USING btree ("_parent_id");
  CREATE INDEX "_academy_v_version_webinars_locale_idx" ON "_academy_v_version_webinars" USING btree ("_locale");
  CREATE INDEX "_academy_v_version_glossary_order_idx" ON "_academy_v_version_glossary" USING btree ("_order");
  CREATE INDEX "_academy_v_version_glossary_parent_id_idx" ON "_academy_v_version_glossary" USING btree ("_parent_id");
  CREATE INDEX "_academy_v_version_glossary_locale_idx" ON "_academy_v_version_glossary" USING btree ("_locale");
  CREATE INDEX "_academy_v_version_version__status_idx" ON "_academy_v" USING btree ("version__status");
  CREATE INDEX "_academy_v_created_at_idx" ON "_academy_v" USING btree ("created_at");
  CREATE INDEX "_academy_v_updated_at_idx" ON "_academy_v" USING btree ("updated_at");
  CREATE INDEX "_academy_v_snapshot_idx" ON "_academy_v" USING btree ("snapshot");
  CREATE INDEX "_academy_v_published_locale_idx" ON "_academy_v" USING btree ("published_locale");
  CREATE INDEX "_academy_v_latest_idx" ON "_academy_v" USING btree ("latest");
  CREATE INDEX "_academy_v_autosave_idx" ON "_academy_v" USING btree ("autosave");
  CREATE INDEX "streams_items_order_idx" ON "streams_items" USING btree ("_order");
  CREATE INDEX "streams_items_parent_id_idx" ON "streams_items" USING btree ("_parent_id");
  CREATE INDEX "streams_items_locale_idx" ON "streams_items" USING btree ("_locale");
  CREATE INDEX "streams_items_poster_idx" ON "streams_items" USING btree ("poster_id");
  CREATE INDEX "streams__status_idx" ON "streams" USING btree ("_status");
  CREATE INDEX "_streams_v_version_items_order_idx" ON "_streams_v_version_items" USING btree ("_order");
  CREATE INDEX "_streams_v_version_items_parent_id_idx" ON "_streams_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_streams_v_version_items_locale_idx" ON "_streams_v_version_items" USING btree ("_locale");
  CREATE INDEX "_streams_v_version_items_poster_idx" ON "_streams_v_version_items" USING btree ("poster_id");
  CREATE INDEX "_streams_v_version_version__status_idx" ON "_streams_v" USING btree ("version__status");
  CREATE INDEX "_streams_v_created_at_idx" ON "_streams_v" USING btree ("created_at");
  CREATE INDEX "_streams_v_updated_at_idx" ON "_streams_v" USING btree ("updated_at");
  CREATE INDEX "_streams_v_snapshot_idx" ON "_streams_v" USING btree ("snapshot");
  CREATE INDEX "_streams_v_published_locale_idx" ON "_streams_v" USING btree ("published_locale");
  CREATE INDEX "_streams_v_latest_idx" ON "_streams_v" USING btree ("latest");
  CREATE INDEX "_streams_v_autosave_idx" ON "_streams_v" USING btree ("autosave");
  CREATE INDEX "contacts_channels_order_idx" ON "contacts_channels" USING btree ("_order");
  CREATE INDEX "contacts_channels_parent_id_idx" ON "contacts_channels" USING btree ("_parent_id");
  CREATE INDEX "contacts_channels_locale_idx" ON "contacts_channels" USING btree ("_locale");
  CREATE INDEX "contacts_offices_order_idx" ON "contacts_offices" USING btree ("_order");
  CREATE INDEX "contacts_offices_parent_id_idx" ON "contacts_offices" USING btree ("_parent_id");
  CREATE INDEX "contacts_offices_locale_idx" ON "contacts_offices" USING btree ("_locale");
  CREATE INDEX "contacts__status_idx" ON "contacts" USING btree ("_status");
  CREATE INDEX "_contacts_v_version_channels_order_idx" ON "_contacts_v_version_channels" USING btree ("_order");
  CREATE INDEX "_contacts_v_version_channels_parent_id_idx" ON "_contacts_v_version_channels" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_version_channels_locale_idx" ON "_contacts_v_version_channels" USING btree ("_locale");
  CREATE INDEX "_contacts_v_version_offices_order_idx" ON "_contacts_v_version_offices" USING btree ("_order");
  CREATE INDEX "_contacts_v_version_offices_parent_id_idx" ON "_contacts_v_version_offices" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_version_offices_locale_idx" ON "_contacts_v_version_offices" USING btree ("_locale");
  CREATE INDEX "_contacts_v_version_version__status_idx" ON "_contacts_v" USING btree ("version__status");
  CREATE INDEX "_contacts_v_created_at_idx" ON "_contacts_v" USING btree ("created_at");
  CREATE INDEX "_contacts_v_updated_at_idx" ON "_contacts_v" USING btree ("updated_at");
  CREATE INDEX "_contacts_v_snapshot_idx" ON "_contacts_v" USING btree ("snapshot");
  CREATE INDEX "_contacts_v_published_locale_idx" ON "_contacts_v" USING btree ("published_locale");
  CREATE INDEX "_contacts_v_latest_idx" ON "_contacts_v" USING btree ("latest");
  CREATE INDEX "_contacts_v_autosave_idx" ON "_contacts_v" USING btree ("autosave");
  CREATE INDEX "careers_benefits_order_idx" ON "careers_benefits" USING btree ("_order");
  CREATE INDEX "careers_benefits_parent_id_idx" ON "careers_benefits" USING btree ("_parent_id");
  CREATE INDEX "careers_benefits_locale_idx" ON "careers_benefits" USING btree ("_locale");
  CREATE INDEX "careers_vacancies_order_idx" ON "careers_vacancies" USING btree ("_order");
  CREATE INDEX "careers_vacancies_parent_id_idx" ON "careers_vacancies" USING btree ("_parent_id");
  CREATE INDEX "careers_vacancies_locale_idx" ON "careers_vacancies" USING btree ("_locale");
  CREATE INDEX "careers__status_idx" ON "careers" USING btree ("_status");
  CREATE INDEX "_careers_v_version_benefits_order_idx" ON "_careers_v_version_benefits" USING btree ("_order");
  CREATE INDEX "_careers_v_version_benefits_parent_id_idx" ON "_careers_v_version_benefits" USING btree ("_parent_id");
  CREATE INDEX "_careers_v_version_benefits_locale_idx" ON "_careers_v_version_benefits" USING btree ("_locale");
  CREATE INDEX "_careers_v_version_vacancies_order_idx" ON "_careers_v_version_vacancies" USING btree ("_order");
  CREATE INDEX "_careers_v_version_vacancies_parent_id_idx" ON "_careers_v_version_vacancies" USING btree ("_parent_id");
  CREATE INDEX "_careers_v_version_vacancies_locale_idx" ON "_careers_v_version_vacancies" USING btree ("_locale");
  CREATE INDEX "_careers_v_version_version__status_idx" ON "_careers_v" USING btree ("version__status");
  CREATE INDEX "_careers_v_created_at_idx" ON "_careers_v" USING btree ("created_at");
  CREATE INDEX "_careers_v_updated_at_idx" ON "_careers_v" USING btree ("updated_at");
  CREATE INDEX "_careers_v_snapshot_idx" ON "_careers_v" USING btree ("snapshot");
  CREATE INDEX "_careers_v_published_locale_idx" ON "_careers_v" USING btree ("published_locale");
  CREATE INDEX "_careers_v_latest_idx" ON "_careers_v" USING btree ("latest");
  CREATE INDEX "_careers_v_autosave_idx" ON "_careers_v" USING btree ("autosave");
  CREATE INDEX "legal_items_sections_paragraphs_markdown_order_idx" ON "legal_items_sections_paragraphs_markdown" USING btree ("_order");
  CREATE INDEX "legal_items_sections_paragraphs_markdown_parent_id_idx" ON "legal_items_sections_paragraphs_markdown" USING btree ("_parent_id");
  CREATE INDEX "legal_items_sections_paragraphs_markdown_locale_idx" ON "legal_items_sections_paragraphs_markdown" USING btree ("_locale");
  CREATE INDEX "legal_items_sections_order_idx" ON "legal_items_sections" USING btree ("_order");
  CREATE INDEX "legal_items_sections_parent_id_idx" ON "legal_items_sections" USING btree ("_parent_id");
  CREATE INDEX "legal_items_sections_locale_idx" ON "legal_items_sections" USING btree ("_locale");
  CREATE INDEX "legal_items_order_idx" ON "legal_items" USING btree ("_order");
  CREATE INDEX "legal_items_parent_id_idx" ON "legal_items" USING btree ("_parent_id");
  CREATE INDEX "legal_items_locale_idx" ON "legal_items" USING btree ("_locale");
  CREATE INDEX "legal__status_idx" ON "legal" USING btree ("_status");
  CREATE INDEX "_legal_v_version_items_sections_paragraphs_markdown_order_idx" ON "_legal_v_version_items_sections_paragraphs_markdown" USING btree ("_order");
  CREATE INDEX "_legal_v_version_items_sections_paragraphs_markdown_parent_id_idx" ON "_legal_v_version_items_sections_paragraphs_markdown" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_version_items_sections_paragraphs_markdown_locale_idx" ON "_legal_v_version_items_sections_paragraphs_markdown" USING btree ("_locale");
  CREATE INDEX "_legal_v_version_items_sections_order_idx" ON "_legal_v_version_items_sections" USING btree ("_order");
  CREATE INDEX "_legal_v_version_items_sections_parent_id_idx" ON "_legal_v_version_items_sections" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_version_items_sections_locale_idx" ON "_legal_v_version_items_sections" USING btree ("_locale");
  CREATE INDEX "_legal_v_version_items_order_idx" ON "_legal_v_version_items" USING btree ("_order");
  CREATE INDEX "_legal_v_version_items_parent_id_idx" ON "_legal_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_version_items_locale_idx" ON "_legal_v_version_items" USING btree ("_locale");
  CREATE INDEX "_legal_v_version_version__status_idx" ON "_legal_v" USING btree ("version__status");
  CREATE INDEX "_legal_v_created_at_idx" ON "_legal_v" USING btree ("created_at");
  CREATE INDEX "_legal_v_updated_at_idx" ON "_legal_v" USING btree ("updated_at");
  CREATE INDEX "_legal_v_snapshot_idx" ON "_legal_v" USING btree ("snapshot");
  CREATE INDEX "_legal_v_published_locale_idx" ON "_legal_v" USING btree ("published_locale");
  CREATE INDEX "_legal_v_latest_idx" ON "_legal_v" USING btree ("latest");
  CREATE INDEX "_legal_v_autosave_idx" ON "_legal_v" USING btree ("autosave");
  CREATE INDEX "system_status_services_order_idx" ON "system_status_services" USING btree ("_order");
  CREATE INDEX "system_status_services_parent_id_idx" ON "system_status_services" USING btree ("_parent_id");
  CREATE INDEX "system_status_services_locale_idx" ON "system_status_services" USING btree ("_locale");
  CREATE INDEX "system_status_incidents_order_idx" ON "system_status_incidents" USING btree ("_order");
  CREATE INDEX "system_status_incidents_parent_id_idx" ON "system_status_incidents" USING btree ("_parent_id");
  CREATE INDEX "system_status_incidents_locale_idx" ON "system_status_incidents" USING btree ("_locale");
  CREATE INDEX "system_status__status_idx" ON "system_status" USING btree ("_status");
  CREATE INDEX "_system_status_v_version_services_order_idx" ON "_system_status_v_version_services" USING btree ("_order");
  CREATE INDEX "_system_status_v_version_services_parent_id_idx" ON "_system_status_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_system_status_v_version_services_locale_idx" ON "_system_status_v_version_services" USING btree ("_locale");
  CREATE INDEX "_system_status_v_version_incidents_order_idx" ON "_system_status_v_version_incidents" USING btree ("_order");
  CREATE INDEX "_system_status_v_version_incidents_parent_id_idx" ON "_system_status_v_version_incidents" USING btree ("_parent_id");
  CREATE INDEX "_system_status_v_version_incidents_locale_idx" ON "_system_status_v_version_incidents" USING btree ("_locale");
  CREATE INDEX "_system_status_v_version_version__status_idx" ON "_system_status_v" USING btree ("version__status");
  CREATE INDEX "_system_status_v_created_at_idx" ON "_system_status_v" USING btree ("created_at");
  CREATE INDEX "_system_status_v_updated_at_idx" ON "_system_status_v" USING btree ("updated_at");
  CREATE INDEX "_system_status_v_snapshot_idx" ON "_system_status_v" USING btree ("snapshot");
  CREATE INDEX "_system_status_v_published_locale_idx" ON "_system_status_v" USING btree ("published_locale");
  CREATE INDEX "_system_status_v_latest_idx" ON "_system_status_v" USING btree ("latest");
  CREATE INDEX "_system_status_v_autosave_idx" ON "_system_status_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "brand_socials" CASCADE;
  DROP TABLE "brand" CASCADE;
  DROP TABLE "_brand_v_version_socials" CASCADE;
  DROP TABLE "_brand_v" CASCADE;
  DROP TABLE "navigation_header" CASCADE;
  DROP TABLE "navigation_footer_columns_links" CASCADE;
  DROP TABLE "navigation_footer_columns" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_locales" CASCADE;
  DROP TABLE "_navigation_v_version_header" CASCADE;
  DROP TABLE "_navigation_v_version_footer_columns_links" CASCADE;
  DROP TABLE "_navigation_v_version_footer_columns" CASCADE;
  DROP TABLE "_navigation_v" CASCADE;
  DROP TABLE "_navigation_v_locales" CASCADE;
  DROP TABLE "faq_sections_items" CASCADE;
  DROP TABLE "faq_sections" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "_faq_v_version_sections_items" CASCADE;
  DROP TABLE "_faq_v_version_sections" CASCADE;
  DROP TABLE "_faq_v" CASCADE;
  DROP TABLE "instruments_items" CASCADE;
  DROP TABLE "instruments" CASCADE;
  DROP TABLE "_instruments_v_version_items" CASCADE;
  DROP TABLE "_instruments_v" CASCADE;
  DROP TABLE "accounts_items_features" CASCADE;
  DROP TABLE "accounts_items" CASCADE;
  DROP TABLE "accounts" CASCADE;
  DROP TABLE "_accounts_v_version_items_features" CASCADE;
  DROP TABLE "_accounts_v_version_items" CASCADE;
  DROP TABLE "_accounts_v" CASCADE;
  DROP TABLE "promotions_items" CASCADE;
  DROP TABLE "promotions" CASCADE;
  DROP TABLE "_promotions_v_version_items" CASCADE;
  DROP TABLE "_promotions_v" CASCADE;
  DROP TABLE "partners_models_features" CASCADE;
  DROP TABLE "partners_models" CASCADE;
  DROP TABLE "partners_tiers" CASCADE;
  DROP TABLE "partners_steps" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "_partners_v_version_models_features" CASCADE;
  DROP TABLE "_partners_v_version_models" CASCADE;
  DROP TABLE "_partners_v_version_tiers" CASCADE;
  DROP TABLE "_partners_v_version_steps" CASCADE;
  DROP TABLE "_partners_v" CASCADE;
  DROP TABLE "academy_articles" CASCADE;
  DROP TABLE "academy_webinars" CASCADE;
  DROP TABLE "academy_glossary" CASCADE;
  DROP TABLE "academy" CASCADE;
  DROP TABLE "_academy_v_version_articles" CASCADE;
  DROP TABLE "_academy_v_version_webinars" CASCADE;
  DROP TABLE "_academy_v_version_glossary" CASCADE;
  DROP TABLE "_academy_v" CASCADE;
  DROP TABLE "streams_items" CASCADE;
  DROP TABLE "streams" CASCADE;
  DROP TABLE "_streams_v_version_items" CASCADE;
  DROP TABLE "_streams_v" CASCADE;
  DROP TABLE "contacts_channels" CASCADE;
  DROP TABLE "contacts_offices" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "_contacts_v_version_channels" CASCADE;
  DROP TABLE "_contacts_v_version_offices" CASCADE;
  DROP TABLE "_contacts_v" CASCADE;
  DROP TABLE "careers_benefits" CASCADE;
  DROP TABLE "careers_vacancies" CASCADE;
  DROP TABLE "careers" CASCADE;
  DROP TABLE "_careers_v_version_benefits" CASCADE;
  DROP TABLE "_careers_v_version_vacancies" CASCADE;
  DROP TABLE "_careers_v" CASCADE;
  DROP TABLE "legal_items_sections_paragraphs_markdown" CASCADE;
  DROP TABLE "legal_items_sections" CASCADE;
  DROP TABLE "legal_items" CASCADE;
  DROP TABLE "legal" CASCADE;
  DROP TABLE "_legal_v_version_items_sections_paragraphs_markdown" CASCADE;
  DROP TABLE "_legal_v_version_items_sections" CASCADE;
  DROP TABLE "_legal_v_version_items" CASCADE;
  DROP TABLE "_legal_v" CASCADE;
  DROP TABLE "system_status_services" CASCADE;
  DROP TABLE "system_status_incidents" CASCADE;
  DROP TABLE "system_status" CASCADE;
  DROP TABLE "_system_status_v_version_services" CASCADE;
  DROP TABLE "_system_status_v_version_incidents" CASCADE;
  DROP TABLE "_system_status_v" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_published_locale";
  DROP TYPE "public"."enum_brand_status";
  DROP TYPE "public"."enum__brand_v_version_status";
  DROP TYPE "public"."enum__brand_v_published_locale";
  DROP TYPE "public"."enum_navigation_status";
  DROP TYPE "public"."enum__navigation_v_version_status";
  DROP TYPE "public"."enum__navigation_v_published_locale";
  DROP TYPE "public"."enum_faq_status";
  DROP TYPE "public"."enum__faq_v_version_status";
  DROP TYPE "public"."enum__faq_v_published_locale";
  DROP TYPE "public"."enum_instruments_items_category";
  DROP TYPE "public"."enum_instruments_status";
  DROP TYPE "public"."enum__instruments_v_version_items_category";
  DROP TYPE "public"."enum__instruments_v_version_status";
  DROP TYPE "public"."enum__instruments_v_published_locale";
  DROP TYPE "public"."enum_accounts_status";
  DROP TYPE "public"."enum__accounts_v_version_status";
  DROP TYPE "public"."enum__accounts_v_published_locale";
  DROP TYPE "public"."enum_promotions_status";
  DROP TYPE "public"."enum__promotions_v_version_status";
  DROP TYPE "public"."enum__promotions_v_published_locale";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum__partners_v_version_status";
  DROP TYPE "public"."enum__partners_v_published_locale";
  DROP TYPE "public"."enum_academy_articles_level";
  DROP TYPE "public"."enum_academy_status";
  DROP TYPE "public"."enum__academy_v_version_articles_level";
  DROP TYPE "public"."enum__academy_v_version_status";
  DROP TYPE "public"."enum__academy_v_published_locale";
  DROP TYPE "public"."enum_streams_items_provider";
  DROP TYPE "public"."enum_streams_items_status";
  DROP TYPE "public"."enum_streams_status";
  DROP TYPE "public"."enum__streams_v_version_items_provider";
  DROP TYPE "public"."enum__streams_v_version_items_status";
  DROP TYPE "public"."enum__streams_v_version_status";
  DROP TYPE "public"."enum__streams_v_published_locale";
  DROP TYPE "public"."enum_contacts_status";
  DROP TYPE "public"."enum__contacts_v_version_status";
  DROP TYPE "public"."enum__contacts_v_published_locale";
  DROP TYPE "public"."enum_careers_status";
  DROP TYPE "public"."enum__careers_v_version_status";
  DROP TYPE "public"."enum__careers_v_published_locale";
  DROP TYPE "public"."enum_legal_status";
  DROP TYPE "public"."enum__legal_v_version_status";
  DROP TYPE "public"."enum__legal_v_published_locale";
  DROP TYPE "public"."enum_system_status_services_status";
  DROP TYPE "public"."enum_system_status_status";
  DROP TYPE "public"."enum__system_status_v_version_services_status";
  DROP TYPE "public"."enum__system_status_v_version_status";
  DROP TYPE "public"."enum__system_status_v_published_locale";`)
}
