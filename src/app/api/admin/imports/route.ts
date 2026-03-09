import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { runFireplaceCatalogImport } from "@/lib/catalog-import";
import { db } from "@/db";
import { catalogSources, importJobs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sourceSlug = searchParams.get("sourceSlug");

  const jobs = await db
    .select({
      id: importJobs.id,
      status: importJobs.status,
      totalCount: importJobs.totalCount,
      successCount: importJobs.successCount,
      errorCount: importJobs.errorCount,
      startedAt: importJobs.startedAt,
      finishedAt: importJobs.finishedAt,
      summary: importJobs.summary,
      sourceName: catalogSources.name,
      sourceSlug: catalogSources.slug,
    })
    .from(importJobs)
    .leftJoin(catalogSources, eq(importJobs.sourceId, catalogSources.id))
    .orderBy(desc(importJobs.id))
    .limit(50);

  if (!sourceSlug) {
    return NextResponse.json({ jobs });
  }

  return NextResponse.json({
    jobs: jobs.filter((job) => job.sourceSlug === sourceSlug),
  });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json();
    const result = await runFireplaceCatalogImport(payload);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Import failed",
      },
      { status: 400 }
    );
  }
}
