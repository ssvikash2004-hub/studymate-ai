import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "StudyMate AI – Intelligent Study Assistant",
  description:
    "Upload your notes and study materials, get instant summaries, ask questions, and generate personalized study plans powered by Google Gemini AI.",
  keywords: "study assistant, AI, PDF summarizer, exam preparation, study plan",
  openGraph: {
    title: "StudyMate AI",
    description: "Your AI-powered study companion",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
