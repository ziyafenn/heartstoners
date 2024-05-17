import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/service/supabase.middleware";
import { deckInteraction } from "./service/supabase.service";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  await updateSession(request);
  if (/^\/decks\/[^/]+$/.test(request.nextUrl.pathname)) {
    const hasUserViewedPage = request.cookies.has("view");
    const deckId = request.nextUrl.pathname.split("/").pop();

    if (!hasUserViewedPage) {
      await deckInteraction({
        deckId: Number(deckId),
        type: "increment_views",
      });
      response.cookies.set({
        name: "view",
        value: "true",
        path: request.nextUrl.pathname,
      });
      return response;
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
