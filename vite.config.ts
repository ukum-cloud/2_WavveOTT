//vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Wavve App',
                short_name: 'Wavve',
                start_url: '/',
                display: 'standalone',
                // 화면이 열릴때 보이는 배경
                background_color: '#ffffff',
                theme_color: '#000000',
                icons: [
                    {
                        // src: "/Wavve_192x192.svg",
                        // sizes: "192x192",
                        // type: "image/svg+xml",
                        src: '/Wavve_192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: '/Wavve_512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable', //
                    },
                ],
            },
        }),
    ],
});
