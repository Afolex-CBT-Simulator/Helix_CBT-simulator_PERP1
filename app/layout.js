import "./globals.css";

export const metadata = {
  title: "Helix Academy - Mock 1.0",
  description:
    "A focused online mock simulator designed to build readiness, mastery, and UTME success.",
  openGraph: {
    title: "Helix Academy - Mock 1.0",
    description:
      "Prepare with purpose, practise with confidence, and build the knowledge that moves you closer to UTME success.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
