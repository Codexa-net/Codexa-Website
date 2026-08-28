-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ClientCategory" AS ENUM ('TECH', 'FITNESS', 'RETAIL', 'BRANDING');

-- AlterTable
ALTER TABLE "portfolio_projects" ADD COLUMN     "clientId" UUID;

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(170) NOT NULL,
    "logoUrl" VARCHAR(500),
    "coverUrl" VARCHAR(500),
    "websiteUrl" VARCHAR(500),
    "sectorEn" VARCHAR(150),
    "sectorAr" VARCHAR(150),
    "descriptionEn" TEXT,
    "descriptionAr" TEXT,
    "testimonialEn" TEXT,
    "testimonialAr" TEXT,
    "testimonialAuthor" VARCHAR(150),
    "testimonialRole" VARCHAR(150),
    "year" VARCHAR(10),
    "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "category" "ClientCategory" NOT NULL DEFAULT 'TECH',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_slug_key" ON "clients"("slug");

-- CreateIndex
CREATE INDEX "clients_isPublished_displayOrder_idx" ON "clients"("isPublished", "displayOrder");

-- CreateIndex
CREATE INDEX "clients_category_idx" ON "clients"("category");

-- CreateIndex
CREATE INDEX "clients_status_idx" ON "clients"("status");

-- CreateIndex
CREATE INDEX "portfolio_projects_clientId_idx" ON "portfolio_projects"("clientId");

-- AddForeignKey
ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
