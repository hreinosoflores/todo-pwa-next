"use client";
import { useCallback, useEffect, useState } from "react";
import { getAllTasks, putTask, deleteTask } from "@/lib/idb";
import { backupTasks } from "@/lib/api";

const uuid = () => crypto.randomUUID();

export default function TodoApp() {
    const [items, setItems] = useState<Task[]>([]);
    const [title, setTitle] = useState("");

    const load = useCallback(async () => {
        const tasks = await getAllTasks();
        setItems(tasks);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    async function add() {
        if (!title.trim()) return;
        const t: Task = { id: uuid(), title: title.trim(), completed: false, updatedAt: new Date().toISOString(), deleted: false };
        await putTask(t);
        setTitle("");
        await load();
    }

    async function toggle(id: string) {
        const t = items.find(x => x.id === id)!;
        await putTask({ ...t, completed: !t.completed, updatedAt: new Date().toISOString() });
        await load();
    }

    async function remove(id: string) {
        await deleteTask(id);
        await load();
    }

    async function backup() {
        const tasks = await getAllTasks();
        const res = await backupTasks(tasks);
        await load();
        alert(`Respaldadas: ${res.upserted} | Conflictos: ${res.conflicts}`);
    }

    return (
        <main style={{ maxWidth: 680, margin: "0 auto", padding: 16 }}>
            <h1>Lista de Tareas act (PWA + IndexedDB)</h1>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input suppressHydrationWarning style={{ flex: 1 }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Nueva tarea..." />
                <button onClick={add}>Agregar</button>
                <button onClick={backup}>Respaldar</button>
            </div>

            <ul style={{ marginTop: 16, listStyle: "none", padding: 0 }}>
                {items.filter(x => !x.deleted).map(t => (
                    <li key={t.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: 8, borderBottom: "1px solid #eee" }}>
                        <input suppressHydrationWarning type="checkbox" checked={t.completed} onChange={() => toggle(t.id)} />
                        <span style={{ flex: 1, textDecoration: t.completed ? "line-through" : "none" }}>{t.title}</span>
                        <button onClick={() => remove(t.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </main>
    );
}
