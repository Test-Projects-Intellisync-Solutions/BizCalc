import React from 'react';
import { Shield } from 'lucide-react';

/**
 * Cookies Policy Page
 * @returns Comprehensive cookies policy content
 */
const CookiesPolicy: React.FC = () => (
  <section className="relative flex justify-center items-start min-h-[80vh] py-12 px-2 bg-gradient-to-br from-fuchsia-50 via-blue-50 to-cyan-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-fuchsia-100/40 via-blue-100/20 to-cyan-100/0 dark:from-fuchsia-900/20 dark:via-blue-900/10 dark:to-zinc-900/0" />
    <div className="relative w-full max-w-2xl bg-white/70 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl">
      <div className="flex flex-col items-center mb-8">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 via-blue-400 to-cyan-400 shadow-lg mb-4">
          <Shield className="h-9 w-9 text-white drop-shadow" />
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-1 text-center">Cookies Policy</h1>
        <p className="text-sm text-muted-foreground mb-2">Last updated: <span className="font-semibold text-blue-700 dark:text-blue-300">May 21, 2025</span></p>
      </div>
      <div className="divide-y divide-blue-100 dark:divide-zinc-800 space-y-8">
        <div className="space-y-4 pt-0">
          <p className="text-lg">BusinessOne does not use cookies. We do not store, track, or monitor any user data through cookies or any similar tracking technologies.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">1. Strict User Privacy</h2>
          <p>We are committed to providing a private and secure experience. No cookies are used for analytics, advertising, personalization, or performance monitoring. Your interactions with our platform are entirely private.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">2. No Third-Party Tools</h2>
          <p>We do not integrate any third-party tools or services that place cookies or collect data. There are no hidden trackers or embedded services that compromise your privacy.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">3. Local Data Storage</h2>
          <p>Any information you choose to save is stored locally on your device in a downloadable JSON format. We do not use browser-based session or local storage.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">4. Policy Updates</h2>
          <p>If our stance on cookies or data collection ever changes, we will update this page and notify users accordingly.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">5. Contact Us</h2>
          <p>For any questions or concerns about our Cookies Policy, please contact us at: <a href="mailto:support@businessone.io" className="underline text-blue-600 dark:text-blue-300">support@businessone.io</a>.</p>
        </div>
      </div>
    </div>
  </section>
);

export default CookiesPolicy;
