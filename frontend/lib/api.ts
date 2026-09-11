export async function fetchApi(
  endpoint: string,
  options: RequestInit = {},
) {
  const isBrowser = typeof window !== 'undefined';

  const baseUrl = isBrowser
    ? '/api/backend'
    : process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3001';

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  const contentType =
    response.headers.get('content-type') || '';

  const data = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : await response.text();

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join('، ')
      : data?.message;

    throw new Error(
      message ||
        `API error: ${response.status} ${response.statusText}`,
    );
  }

  return data;
}