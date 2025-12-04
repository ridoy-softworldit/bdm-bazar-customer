/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "ds.rokomari.store",
      "encrypted-tbn0.gstatic.com",
      "vectorseek.com",
      "cdn.iconscout.com",
      "img.favpng.com",
      "cdn.example.com",
      "rokbucket.rokomari.io",
      "png.pngtree.com",
      "placehold.co",
      "img.freepik.com",
      "example.com",
      "upload.wikimedia.org",
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;
