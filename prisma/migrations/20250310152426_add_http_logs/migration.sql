-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HttpLog" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "headers" JSONB,
    "params" JSONB,
    "query" JSONB,
    "body" JSONB,
    "response" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HttpLog_pkey" PRIMARY KEY ("id")
);
