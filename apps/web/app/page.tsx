async function getHealth() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/health`,
      { cache: "no-store" }
    );

    if (!res.ok) return "error";
    const data = await res.json();
    return data.status;
  } catch {
    return "not reachable";
  }
}

export default async function Home() {
  const apiStatus = await getHealth();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">CMS Web App</h1>
      <p className="mt-2 text-gray-500">Web is running</p>
      <p className="mt-4">
        API status:{" "}
        <span className="font-mono text-green-500">
          {apiStatus}
        </span>
      </p>
    </main>
  );
}
