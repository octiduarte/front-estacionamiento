import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Example: Replace with your real user DB lookup
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_HASH = process.env.ADMIN_HASH; // bcrypt hash

console.log('ADMIN_USER:', process.env.ADMIN_USER);
console.log('ADMIN_HASH:', process.env.ADMIN_HASH);


export async function POST() {
  // Siempre responde como login exitoso
  return NextResponse.json({ success: true });
}
