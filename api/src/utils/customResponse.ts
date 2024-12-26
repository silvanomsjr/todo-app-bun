export default function customResponse(
  body: unknown,
  options: Partial<ResponseInit> = {},
) {
  const defaultHeaders = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  return new Response(JSON.stringify(body), {
    headers: { ...defaultHeaders, ...options.headers },
    status: options.status || 200,
  });
}
