// app/api/visitors/route.ts
import { NextResponse } from "next/server";
import { getSupabase } from "app/db/supabase";
import { parseVisitorRow } from "app/lib/visitorCounter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { id?: string }
//  - known id  -> return the existing record, do NOT increment
//  - no/unknown id -> register a new visitor (atomic in Postgres)
// Always fails soft: missing config or any Supabase error returns { ok: false }
// so the page is never broken by the counter.
export async function POST(request: Request) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ ok: false });

  try {
    const body = (await request.json().catch(() => ({}))) as { id?: unknown };
    const id = typeof body.id === "string" ? body.id : null;

    if (id) {
      const { data, error } = await supabase.rpc("lookup_visitor", { p_id: id });
      if (!error) {
        const existing = parseVisitorRow(data?.[0]);
        if (existing) return NextResponse.json({ ok: true, ...existing });
      }
    }

    const { data, error } = await supabase.rpc("register_visitor");
    if (error) {
      // Surfaces a misconfigured deploy (bad key / missing RPC) in Vercel logs;
      // the response still fails soft so the page is never broken.
      console.error("[visitors] register_visitor failed:", error.message);
      return NextResponse.json({ ok: false });
    }
    const record = parseVisitorRow(data?.[0]);
    if (!record) return NextResponse.json({ ok: false });
    return NextResponse.json({ ok: true, ...record });
  } catch (err) {
    console.error("[visitors] unexpected error:", err);
    return NextResponse.json({ ok: false });
  }
}
