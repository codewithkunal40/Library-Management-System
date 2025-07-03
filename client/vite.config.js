// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000',
//         changeOrigin: true,
//       },
//     },
//     headers: {
//       // Allow popups from same-origin (required by Firebase popup)
//       'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
//       'Cross-Origin-Embedder-Policy': 'require-corp',
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    // Remove the headers field here
    // Instead, use configureServer below
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        next();
      });
    },
  },
})
