"use client";

export async function backupTasks(tasks: Task[]) {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE;
    const res = await fetch(`${apiBase}/tasks/bulk_upsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks })
    });
    if (!res.ok) throw new Error(`Backup failed: ${res.status}`);
    return await res.json();
}
