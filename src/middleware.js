import { NextResponse } from 'next/server';

const protectedRoutes = ['/transactions', '/profile'];

export function middleware(request) {
  const token = request.cookies.get('Walletly_Token');
  const path = request.nextUrl.pathname;

  // Get the first part of the pathname 
  const firstPathSegment = path.split('/')[1];

  // Redirect to /auth if trying to access protected routes without a token
  if (protectedRoutes.includes(path) && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if ((firstPathSegment === 'auth' || path === '/') && token) {
    return NextResponse.redirect(new URL('/transactions', request.url)); 
  }

  return NextResponse.next();
}

// Apply middleware to all necessary routes
export const config = {
  matcher: ['/transactions', '/profile', '/auth', '/auth/login','/auth/signup','/'], 
};
