export async function diagnoseDisease(imageBase64: string) {
  const res = await fetch("http://localhost:8000/diagnose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64 }),
  });
  return res.json();
}
