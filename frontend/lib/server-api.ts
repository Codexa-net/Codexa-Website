import { cookies } from 'next/headers';

function getErrorMessage(
  payload: unknown,
  status: number,
): string {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const message = (payload as { message?: unknown }).message;

    if (Array.isArray(message)) {
      return message
        .filter((item): item is string => typeof item === 'string')
        .join('، ');
    }

    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return `حدث خطأ في الاتصال بالخادم (${status})`;
}

export async function serverFetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    'http://localhost:3001';

  const baseUrl = configuredBaseUrl.replace(/\/+$/, '');
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const headers = new Headers(options.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (
    options.body &&
    !headers.has('Content-Type') &&
    !(options.body instanceof FormData)
  ) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(
    `${baseUrl}${normalizedEndpoint}`,
    {
      ...options,
      headers,
      cache: 'no-store',
    },
  );

  const responseText = await response.text();

  let responseData: unknown = null;

  if (responseText.trim()) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(responseData, response.status),
    );
  }

  return responseData as T;
}