export async function POST() {
  return Response.json(
    { error: 'Import analysis is disabled until admin authentication is implemented.' },
    { status: 503 },
  );
}
