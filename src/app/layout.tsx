import type { Metadata } from "next";
import { Rock_Salt, Space_Grotesk } from "next/font/google";
import "./globals.css";
import TopNav from "@components/layout/TopNav";
import ThemeProvider from "@components/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
	weight: ["300", "700"],
	style: ["normal"],
	subsets: ["latin"],
});

const rockSalt = Rock_Salt({
	weight: "400",
	style: "normal",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "SNL – Saturday Normal Library",
	description: "Study group made for students by students in Melbourne",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${spaceGrotesk.className} min-h-dvh w-screen overflow-x-hidden`}>
				<ThemeProvider>
					<header>
						<TopNav />
					</header>
					<main className="h-full w-full">{children}</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
