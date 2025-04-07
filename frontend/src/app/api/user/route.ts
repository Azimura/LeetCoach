"use server";
export async function POST(request: Request) {
  const response = await fetch("http://127.0.0.1:5000/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: await request.json(),
  });
  return await response.json();
}
