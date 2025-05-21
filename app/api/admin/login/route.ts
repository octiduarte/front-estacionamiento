import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Example: Replace with your real user DB lookup
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_HASH = process.env.ADMIN_HASH; // bcrypt hash

console.log('ADMIN_USER:', process.env.ADMIN_USER);
console.log('ADMIN_HASH:', process.env.ADMIN_HASH);

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
  }
  if (username !== ADMIN_USER) {
    return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
  }
  if (!ADMIN_HASH) {
    return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
  }
  const valid = await bcrypt.compare(password, ADMIN_HASH as string);
  if (!valid) {
    return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
  }
  // Set a session cookie or JWT here for real auth
  // For demo, set a simple cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "admin-auth",
    value: "1",
    httpOnly: true,
    path: "/",
    sameSite: "lax"
  });
  return response;
}
