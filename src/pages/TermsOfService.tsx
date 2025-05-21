import React from 'react';
import { Shield } from 'lucide-react';

const TermsOfService: React.FC = () => (
  <section className="relative flex justify-center items-start min-h-[80vh] py-12 px-2 bg-gradient-to-br from-fuchsia-50 via-blue-50 to-cyan-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-fuchsia-100/40 via-blue-100/20 to-cyan-100/0 dark:from-fuchsia-900/20 dark:via-blue-900/10 dark:to-zinc-900/0" />
    <div className="relative w-full max-w-2xl bg-white/70 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl">
      <div className="flex flex-col items-center mb-8">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 via-blue-400 to-cyan-400 shadow-lg mb-4">
          <Shield className="h-9 w-9 text-white drop-shadow" />
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-1 text-center">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-2">Last updated: <span className="font-semibold text-blue-700 dark:text-blue-300">May 21, 2025</span></p>
      </div>
      <div className="divide-y divide-blue-100 dark:divide-zinc-800 space-y-8">
        <div className="space-y-4 pt-0">
          <p className="text-lg">Welcome to <span className="font-bold text-fuchsia-600">BusinessOne</span>. By accessing or using our website, tools, and services, you agree to be bound by these Terms of Service. Please read them carefully.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">1. Acceptance of Terms</h2>
          <p>By using BusinessOne, you agree to comply with and be legally bound by these Terms. If you do not agree, do not use the service.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">2. Modifications</h2>
          <p>We may modify these Terms at any time. We will notify users of significant changes. Continued use of the service after modifications constitutes acceptance of the new Terms.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">3. User Accounts</h2>
          <p>To access certain features, you may be required to create an account. You agree to provide accurate information and keep your account credentials secure. You are responsible for all activity under your account.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">4. Use of Service</h2>
          <p>You agree to use the service only for lawful purposes and in accordance with these Terms. You may not use the service to:</p>
          <ul className="list-disc list-inside ml-4 text-base space-y-1">
            <li>Violate any laws or regulations</li>
            <li>Infringe intellectual property rights</li>
            <li>Distribute malware or other harmful content</li>
            <li>Engage in fraudulent or misleading behavior</li>
          </ul>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">5. Intellectual Property</h2>
          <p>All content on BusinessOne, including text, graphics, logos, and software, is the property of BusinessOne or its licensors and is protected by copyright and trademark laws.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">6. Disclaimer of Warranties</h2>
          <p>The service is provided <span className="italic">“as is”</span> without warranties of any kind. We do not guarantee that the service will be secure, error-free, or available at all times.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, BusinessOne shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">8. Termination</h2>
          <p>We may suspend or terminate your access to the service at our discretion, without notice, if you violate these Terms or engage in harmful conduct.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">9. Governing Law</h2>
          <p>These Terms are governed by the laws of Ontario, Canada. Any disputes shall be resolved in the provincial or federal courts located in Ontario.</p>
        </div>
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">10. Contact Information</h2>
          <div className="bg-blue-50 dark:bg-zinc-800 rounded-lg p-4 flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-400" />
            <span>If you have any questions about these Terms, please contact us at <a href="mailto:support@businessone.io" className="underline text-blue-600 dark:text-blue-300">support@businessone.io</a>.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);
 

export default TermsOfService;
