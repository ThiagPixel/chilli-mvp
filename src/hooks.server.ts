import { createServerClient } from "@supabase/ssr";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";
import type { Handle } from "@sveltejs/kit";

interface Cookie {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return event.cookies.getAll();
        },
        setAll(cookiesToSet: Cookie[]) {
          cookiesToSet.forEach((cookie: Cookie) => {
            event.cookies.set(cookie.name, cookie.value, {
              ...cookie.options,
              path: "/",
            });
          });
        },
      },
    },
  );

  event.locals.safeGetSession = async () => {
    // First check if a session exists in cookies
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();

    if (!session) {
      return { session: null, user: null };
    }

    // Always validate the session by calling getUser() to ensure authenticity
    // getSession() returns data from cookies which could be tampered with
    // getUser() validates the session with Supabase auth server
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();

    if (error) {
      // Session exists but user validation failed - session is invalid
      return { session: null, user: null };
    }

    // Session is valid and user is authenticated
    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};
