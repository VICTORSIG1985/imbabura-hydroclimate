// Root layout for non-locale paths.  next-intl middleware redirects /
// to /es by default; this layout exists so Next.js doesn't error on /.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
