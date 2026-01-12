import { NextRequest, NextResponse } from 'next/server';

/**
 * Extract IP address from request headers
 * Priority: x-forwarded-for > x-real-ip > x-client-ip > default
 */
function getClientIP(request: NextRequest): string {
  // Check Vercel/Cloudflare headers first (highest priority)
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  if (vercelCountry) {
    return vercelCountry;
  }

  const cloudflareCountry = request.headers.get('cf-ipcountry');
  if (cloudflareCountry) {
    return cloudflareCountry;
  }

  const customCountry = request.headers.get('x-country-code');
  if (customCountry) {
    return customCountry;
  }

  // Extract IP address from headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    return ips[0];
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const clientIP = request.headers.get('x-client-ip');
  if (clientIP) {
    return clientIP;
  }

  // Default fallback (for development)
  return '8.8.8.8';
}

/**
 * Detect country using ipapi.co
 */
async function detectCountryViaIpapi(ip: string): Promise<string | null> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.country_code && typeof data.country_code === 'string') {
      return data.country_code.toUpperCase();
    }

    return null;
  } catch (error) {
    console.error('ipapi.co error:', error);
    return null;
  }
}

/**
 * Detect country using ip-api.com
 */
async function detectCountryViaIpApi(ip: string): Promise<string | null> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.countryCode && typeof data.countryCode === 'string') {
      return data.countryCode.toUpperCase();
    }

    return null;
  } catch (error) {
    console.error('ip-api.com error:', error);
    return null;
  }
}

/**
 * Main API handler
 */
export async function GET(request: NextRequest) {
  try {
    // First check if we have country code directly from headers (Vercel/Cloudflare)
    const vercelCountry = request.headers.get('x-vercel-ip-country');
    if (vercelCountry) {
      return NextResponse.json({ country: vercelCountry.toUpperCase() });
    }

    const cloudflareCountry = request.headers.get('cf-ipcountry');
    if (cloudflareCountry) {
      return NextResponse.json({ country: cloudflareCountry.toUpperCase() });
    }

    const customCountry = request.headers.get('x-country-code');
    if (customCountry) {
      return NextResponse.json({ country: customCountry.toUpperCase() });
    }

    // Extract IP address
    const ip = getClientIP(request);

    // If IP is already a country code (from headers), return it
    if (ip.length === 2) {
      return NextResponse.json({ country: ip.toUpperCase() });
    }

    // Try ipapi.co first
    const countryFromIpapi = await detectCountryViaIpapi(ip);
    if (countryFromIpapi) {
      return NextResponse.json({ country: countryFromIpapi });
    }

    // Fallback to ip-api.com
    const countryFromIpApi = await detectCountryViaIpApi(ip);
    if (countryFromIpApi) {
      return NextResponse.json({ country: countryFromIpApi });
    }

    // Default fallback
    return NextResponse.json({ country: 'US' });
  } catch (error) {
    console.error('Country detection error:', error);
    return NextResponse.json({ country: 'US' }, { status: 200 });
  }
}
