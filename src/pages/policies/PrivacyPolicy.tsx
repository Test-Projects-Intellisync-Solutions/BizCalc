import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
          <ShieldCheck className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-xl text-gray-600">Last updated: June 2, 2025</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Privacy Commitment</h2>
          <p className="mb-4">
            At IntelliSync Solutions, we believe in transparency and respect for your privacy. That's why we've designed our application to be privacy-focused from the ground up.
          </p>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
            <p className="font-medium text-green-800">
              <span className="font-bold">Important:</span> We do not track you. We do not use cookies. We do not collect or store your personal data. Your calculations stay private on your device.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Don't Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>No personal information</li>
            <li>No financial data you input</li>
            <li>No usage analytics</li>
            <li>No tracking cookies</li>
            <li>No IP addresses or device identifiers</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Protect Your Privacy</h2>
          <p className="mb-4">
            Our application is designed with privacy as a core principle:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>All calculations happen directly in your browser</li>
            <li>No data is sent to our servers</li>
            <li>No third-party tracking or analytics</li>
            <li>No data sharing with third parties</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
          <p className="mb-4">
            Since we don't collect your data, you don't need to worry about:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Requesting access to your data</li>
            <li>Asking us to delete your information</li>
            <li>Opting out of data collection</li>
            <li>Worrying about data breaches</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
          <p>
            If we ever make changes to this privacy policy, we'll update the "Last updated" date at the top of this page. Any changes will be effective immediately upon posting.
          </p>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@intellisync.solutions" className="text-primary hover:underline">
              privacy@intellisync.solutions
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
