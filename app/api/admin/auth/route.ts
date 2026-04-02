import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'admin@escortnepal.com';
const ADMIN_PASSWORD = 'admin@1498';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', 'verified', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}

export async function GET() {
  // Check if admin is authenticated
  const response = NextResponse.json({ authenticated: false });
  return response;
}
