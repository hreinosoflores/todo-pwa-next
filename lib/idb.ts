"use client";
import { openDB, DBSchema } from "idb";

interface TodoDB extends DBSchema {
    tasks: {
        key: string;
        value: Task;
        indexes: {
            "by-updatedAt": string
        }
    };
}

export async function db() {
    return openDB<TodoDB>("todo-db", 1, {
        upgrade(d) {
            const store = d.createObjectStore("tasks", { keyPath: "id" });
            store.createIndex("by-updatedAt", "updatedAt");
        }
    });
}

export async function putTask(t: Task) {
    const d = await db();
    d.put("tasks", t);
    // (await db()).put("tasks", t);
}
export async function getAllTasks(): Promise<Task[]> {
    const d = await db();
    return d.getAll("tasks");
    // return (await db()).getAll("tasks");
}
export async function deleteTask(id: string) {
    const d = await db();
    const t = await d.get("tasks", id);
    if (!t) return;
    t.deleted = true;
    t.updatedAt = new Date().toISOString();
    await d.put("tasks", t);
}
export async function purgeDeleted() {
    const d = await db();
    const tasks = await d.getAll("tasks");
    await Promise.all(
        tasks
            .filter(x => x.deleted)
            .map(x => d.delete("tasks", x.id))
    );
}
