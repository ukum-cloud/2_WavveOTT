import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        // 1. 경고 제한 수치를 500kb에서 1000kb(1MB)로 상향
        chunkSizeWarningLimit: 1000,

        // 2. 대형 라이브러리(vendor) 분리 설정
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // node_modules에 있는 것들은 별도의 파일로 쪼갭니다.
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                },
            },
        },
    },
});
