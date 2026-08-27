-- CreateTable
CREATE TABLE "website_settings" (
    "id" VARCHAR(50) NOT NULL DEFAULT 'default',
    "companyName" VARCHAR(200) NOT NULL DEFAULT 'Codexa',
    "slogan" VARCHAR(300),
    "description" TEXT,
    "logoUrl" VARCHAR(500),
    "faviconUrl" VARCHAR(500),
    "aboutTitle" VARCHAR(200),
    "aboutDescription" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "values" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "contactEmail" VARCHAR(255),
    "contactPhone" VARCHAR(30),
    "contactAddress" VARCHAR(500),
    "workingHours" VARCHAR(200),
    "mapLocationUrl" VARCHAR(500),
    "metaTitle" VARCHAR(200),
    "metaDescription" VARCHAR(500),
    "metaKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ogImageUrl" VARCHAR(500),
    "twitterHandle" VARCHAR(50),
    "canonicalUrl" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" UUID NOT NULL,
    "platform" VARCHAR(50) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "icon" VARCHAR(100),
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "social_links_isEnabled_displayOrder_idx" ON "social_links"("isEnabled", "displayOrder");
