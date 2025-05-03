import { Calculator } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">BusinessOne</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional financial planning and analysis tools for modern enterprises.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/intellisyncsol" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/intellisync-solutions" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="https://github.com/intellisyncsolutions" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Products</h4>
            <ul className="space-y-2">
              <li>
                <a href="#calculators" className="text-sm text-muted-foreground hover:text-primary">Financial Calculators</a>
              </li>
              <li>
                <a href="#tools" className="text-sm text-muted-foreground hover:text-primary">Business Tools</a>
              </li>
              <li>
                <a href="#docs" className="text-sm text-muted-foreground hover:text-primary">Documentation</a>
              </li>
              {/*
              <li>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</a>
              </li>
              // Pricing link commented out for testing
              */}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</a>
              </li>
              <li>
                <a href="/guides" className="text-sm text-muted-foreground hover:text-primary">Guides</a>
              </li>
              <li>
                <a href="/case-studies" className="text-sm text-muted-foreground hover:text-primary">Case Studies</a>
              </li>
              <li>
                <a href="/support" className="text-sm text-muted-foreground hover:text-primary">Support</a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-muted-foreground hover:text-primary">About</a>
              </li>
              <li>
                <a href="/careers" className="text-sm text-muted-foreground hover:text-primary">Careers</a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
              </li>
              <li>
                <a href="mailto:chris.june@intellisync.ca" className="text-sm text-muted-foreground hover:text-primary">Email Us</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t py-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} IntelliSync Solutions. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <a href="/privacy" className="hover:text-primary">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary">Terms of Service</a>
            <a href="/cookies" className="hover:text-primary">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}