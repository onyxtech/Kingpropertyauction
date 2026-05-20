import { useState } from "react";
import FooterNewsletter from "./FooterNewsletter";
import FooterLinks from "./FooterLinks";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setNewsletterLoading(true);
    setNewsletterError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0],
          email: email.trim(),
          phone: "",
          subject: "Newsletter Subscription",
          message: `Newsletter subscription request from ${email}`,
          leadType: "newsletter",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 5000);
      } else {
        setNewsletterError("Failed to subscribe. Please try again.");
        setTimeout(() => setNewsletterError(""), 3000);
      }
    } catch {
      setNewsletterError("Network error. Please try again.");
      setTimeout(() => setNewsletterError(""), 3000);
    }
    setNewsletterLoading(false);
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 size-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <FooterNewsletter
          email={email}
          setEmail={setEmail}
          onSubmit={handleNewsletterSubmit}
          subscribed={subscribed}
          loading={newsletterLoading}
          error={newsletterError}
        />
        <FooterLinks />
      </div>
    </footer>
  );
}
