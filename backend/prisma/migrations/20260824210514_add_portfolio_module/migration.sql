-- CreateTable
CREATE TABLE "portfolio_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_technologies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_technologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_projects" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" VARCHAR(500),
    "githubUrl" VARCHAR(500),
    "liveUrl" VARCHAR(500),
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToTechnology" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ProjectToTechnology_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_categories_name_key" ON "portfolio_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_categories_slug_key" ON "portfolio_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_technologies_name_key" ON "portfolio_technologies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_technologies_slug_key" ON "portfolio_technologies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_projects_slug_key" ON "portfolio_projects"("slug");

-- CreateIndex
CREATE INDEX "portfolio_projects_categoryId_idx" ON "portfolio_projects"("categoryId");

-- CreateIndex
CREATE INDEX "portfolio_projects_isFeatured_idx" ON "portfolio_projects"("isFeatured");

-- CreateIndex
CREATE INDEX "portfolio_projects_createdAt_idx" ON "portfolio_projects"("createdAt");

-- CreateIndex
CREATE INDEX "_ProjectToTechnology_B_index" ON "_ProjectToTechnology"("B");

-- AddForeignKey
ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "portfolio_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTechnology" ADD CONSTRAINT "_ProjectToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "portfolio_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTechnology" ADD CONSTRAINT "_ProjectToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "portfolio_technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
