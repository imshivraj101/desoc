import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})



// import { defineConfig, loadEnv } from "vite"
// import react from "@vitejs/plugin-react"
// import path from "path"
// import tailwindcss from '@tailwindcss/vite'// https://vite.dev/config/


// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => {
//   // Load env file based on `mode` in the current working directory.
//   // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
//   const env = loadEnv(mode, process.cwd(), "")

//   return {
//     plugins: [react(),tailwindcss()],
//     resolve: {
//       alias: {
//         "@": path.resolve(__dirname, "./src"),
//       },
//     },
//     server: {
//       port: 3000,
//       proxy: {
//         "/api": {
//           target: env.REACT_APP_API_URL || "https://prime-rpu9.onrender.com",
//           changeOrigin: true,
//           secure: false,
//         },
//       },
//     },
//     define: {
//       "process.env": env,
//     },
//   }
// })
