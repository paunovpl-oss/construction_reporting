import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const assignableRoles = new Set([
  "admin",
  "site_manager",
  "project_manager",
  "designer",
  "contractor",
  "accountant"
]);

const managerRoles = new Set(["admin", "project_manager", "site_manager"]);

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: "Missing Supabase environment configuration" }, 500);
    }

    const body = await req.json();
    const accessToken = String(body?.accessToken ?? "").trim();

    const authHeader = req.headers.get("Authorization") ?? "";
    const headerToken = authHeader.replace("Bearer ", "").trim();
    const jwt = accessToken || headerToken;

    if (!jwt) {
      return jsonResponse({ error: "Missing Authorization header" }, 401);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const userResult = await adminClient.auth.getUser(jwt);
    if (userResult.error || !userResult.data.user) {
      return jsonResponse({ error: "Invalid or expired token" }, 401);
    }

    const currentUserId = userResult.data.user.id;

    const adminCheck = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUserId)
      .maybeSingle();

    if (adminCheck.error || !managerRoles.has(String(adminCheck.data?.role ?? ""))) {
      return jsonResponse({ error: "Admin privileges required" }, 403);
    }

    const action = body?.action;
    const payload = body?.payload ?? {};

    if (action === "list") {
      const usersResult = await adminClient.auth.admin.listUsers();
      if (usersResult.error) {
        return jsonResponse({ error: usersResult.error.message }, 400);
      }

      const users = usersResult.data.users ?? [];
      const ids = users.map((user) => user.id);

      const roleResult = ids.length
        ? await adminClient
            .from("user_roles")
            .select("user_id,role")
            .in("user_id", ids)
        : { data: [], error: null };

      if (roleResult.error) {
        return jsonResponse({ error: roleResult.error.message }, 400);
      }

      const roleMap = new Map((roleResult.data ?? []).map((entry) => [entry.user_id, entry.role]));

      return jsonResponse({
        users: users.map((user) => ({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          role: roleMap.get(user.id) ?? "contractor"
        }))
      });
    }

    if (action === "create") {
      const email = String(payload.email ?? "").trim();
      const password = String(payload.password ?? "").trim();
      const role = String(payload.role ?? "contractor");

      if (!assignableRoles.has(role)) {
        return jsonResponse({ error: "Invalid role value" }, 400);
      }

      if (!email || !password) {
        return jsonResponse({ error: "Email and password are required" }, 400);
      }

      const createResult = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: email.split("@")[0]
        }
      });

      if (createResult.error || !createResult.data.user) {
        return jsonResponse({ error: createResult.error?.message ?? "Unable to create user" }, 400);
      }

      const newUserId = createResult.data.user.id;
      const roleUpsert = await adminClient
        .from("user_roles")
        .upsert({ user_id: newUserId, role }, { onConflict: "user_id" });

      if (roleUpsert.error) {
        return jsonResponse({ error: roleUpsert.error.message }, 400);
      }

      return jsonResponse({
        user: {
          id: newUserId,
          email: createResult.data.user.email,
          role
        }
      });
    }

    if (action === "delete") {
      const userId = String(payload.userId ?? "").trim();
      if (!userId) {
        return jsonResponse({ error: "userId is required" }, 400);
      }

      if (userId === currentUserId) {
        return jsonResponse({ error: "Admin cannot delete current signed in user" }, 400);
      }

      const deleteResult = await adminClient.auth.admin.deleteUser(userId);
      if (deleteResult.error) {
        return jsonResponse({ error: deleteResult.error.message }, 400);
      }

      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: "Unsupported action" }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return jsonResponse({ error: message }, 500);
  }
});
