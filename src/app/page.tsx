import { redirect } from "next/navigation";

export default function Home() {
    redirect("/en");  // ✅ هماهنگ با defaultLocale در middleware
}