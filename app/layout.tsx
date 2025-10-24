export const metadata = { title: "TODO PWA" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#111111" />
            </head>
            <body>{children}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        if ('serviceWorker' in navigator) {
                            window.addEventListener('load', () => {
                                navigator.serviceWorker.register('/sw.js').catch(console.error);
                            });
                        }
                    `}}
                />
            </body>
        </html>
    );
}
