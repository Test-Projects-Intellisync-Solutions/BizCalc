import { Cookie } from 'lucide-react';

export default function CookiesPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-4">
          <Cookie className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookies Policy</h1>
        <p className="text-xl text-gray-600">Last updated: June 2, 2025</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Approach to Cookies</h2>
          <p className="mb-4">
            At IntelliSync Solutions, we respect your privacy and believe in being transparent about our practices. That's why we want to make something very clear:
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
            <p className="font-medium text-amber-800">
              <span className="font-bold">Important:</span> We do not use any cookies, tracking technologies, or similar technologies in our application.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What This Means for You</h2>
          <p className="mb-4">
            Because we don't use cookies or tracking technologies:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>No cookie banners are needed</li>
            <li>No need to manage cookie preferences</li>
            <li>No tracking of your activity across the web</li>
            <li>No third-party tracking scripts</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Browser Storage</h2>
          <p className="mb-4">
            Our application may use your browser's local storage to save your preferences and calculations for your convenience. This information is stored only on your device and is not sent to our servers.
          </p>
          <p>
            You can clear this data at any time through your browser's settings if you wish to remove any locally stored information.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
          <p>
            If we ever decide to use cookies or similar technologies in the future, we will update this policy and provide you with clear information about the types of cookies we use and their purposes.
          </p>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Cookies Policy, please contact us at{' '}
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
