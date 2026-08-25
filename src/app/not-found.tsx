import Link from "next/link";

export default function RootNotFound() {
    return (
        <html lang="en">
            <head>
                <title>404 - Page Not Found | Aurel Design Studio</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="noindex" />
            </head>
            <body
                style={{
                    margin: 0,
                    minHeight: "100vh",
                    background: "#050505",
                    color: "white",
                    fontFamily: "system-ui, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div style={{ textAlign: "center", padding: "2rem" }}>
                    <h1
                        style={{
                            fontSize: "clamp(5rem, 20vw, 12rem)",
                            fontWeight: 200,
                            margin: 0,
                            background: "linear-gradient(to bottom, #FFE8A3, #D4AF37, #8B7332)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            lineHeight: 1,
                        }}
                    >
                        404
                    </h1>
                    <div
                        style={{
                            width: "8rem",
                            height: "1px",
                            margin: "2rem auto",
                            background:
                                "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.6), transparent)",
                        }}
                    />
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 300, margin: "1rem 0" }}>
                        Page Not Found
                    </h2>
                    <p style={{ color: "#e5e5e5", maxWidth: "32rem", margin: "1.5rem auto" }}>
                        صفحه‌ای که به دنبال آن هستید وجود ندارد
                        <br />
                        <span style={{ color: "#a3a3a3", fontSize: "0.9rem" }}>
                            The page you're looking for doesn't exist
                        </span>
                    </p>
                    <div style={{ marginTop: "3rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link
                            href="/fa"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "1rem 2.5rem",
                                border: "1px solid rgba(212, 175, 55, 0.4)",
                                borderRadius: "9999px",
                                color: "#D4AF37",
                                textDecoration: "none",
                                fontSize: "0.875rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.2em",
                            }}
                        >
                            فارسی
                        </Link>
                        <Link
                            href="/en"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "1rem 2.5rem",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "9999px",
                                color: "#e5e5e5",
                                textDecoration: "none",
                                fontSize: "0.875rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.2em",
                            }}
                        >
                            English
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}