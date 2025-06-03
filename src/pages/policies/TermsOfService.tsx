import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-xl text-gray-600">Last updated: June 2, 2025</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the IntelliSync Solutions financial calculators ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="mb-4">
            Our Service provides financial calculation tools for informational purposes only. The Service is designed to be private, with all calculations performed locally in your browser.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
            <p className="font-medium text-blue-800">
              <span className="font-bold">Important:</span> Our Service does not collect, store, or process your personal or financial data. All calculations remain on your device.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. No Financial Advice</h2>
          <p className="mb-4">
            The information provided by our Service is for general informational purposes only and should not be considered as financial, investment, tax, or legal advice. We recommend consulting with a qualified professional for advice specific to your financial situation.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. No Warranties</h2>
          <p className="mb-4">
            The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>The Service will be uninterrupted or error-free</li>
            <li>The results obtained from using the Service will be accurate or reliable</li>
            <li>The quality of any information obtained through the Service will meet your expectations</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
          <p className="mb-4">
            To the fullest extent permitted by applicable law, IntelliSync Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Your use or inability to use the Service</li>
            <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
            <li>Any interruption or cessation of transmission to or from our Service</li>
            <li>Any bugs, viruses, or the like that may be transmitted to or through our Service</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will provide notice of any changes by updating the "Last updated" date at the top of this page. Your continued use of the Service after any such changes constitutes your acceptance of the new terms.
          </p>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:legal@intellisync.solutions" className="text-primary hover:underline">
              legal@intellisync.solutions
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
