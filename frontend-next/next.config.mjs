// Renomeado para next.config.mjs
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/:path*", // Corrigido para redirecionar corretamente
      },
    ];
  },
};

export default nextConfig;
// Ensure the development server is started on port 3000
