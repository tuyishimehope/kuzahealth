// src/components/layout/Footer.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

/**
 * Interface for a footer navigation link
 */
interface FooterLink {
  /** Display name of the link */
  name: string;
  
  /** URL or route path */
  href: string;
}

/**
 * Interface for footer links organized by section
 */
interface FooterLinks {
  company: FooterLink[];
  services: FooterLink[];
  resources: FooterLink[];
  legal: FooterLink[];
}

/**
 * Interface for a social media link
 */
interface SocialLink {
  /** Name of the social platform */
  name: string;
  
  /** URL to the social media page */
  href: string;
  
  /** SVG icon element */
  icon: React.ReactNode;
}

/**
 * Footer component with navigation links, contact info, and newsletter signup
 * 
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
const Footer: React.FC = () => {
  // State for newsletter form
  const [email, setEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  
  // Footer links
  const footerLinks: FooterLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    services: [
      { name: 'Vaccinations', href: '/services/vaccinations' },
      { name: 'Social Services', href: '/services/social' },
      { name: 'Nutrition', href: '/services/nutrition' },
      { name: 'Maternal Care', href: '/services/maternal-care' },
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Guides', href: '/guides' },
      { name: 'Research', href: '/research' },
      { name: 'FAQ', href: '/faq' },
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  // Social media links
  const socialLinks: SocialLink[] = [
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  // Handle newsletter subscription
  const handleSubscribe = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // In a real app, this would call an API to handle the subscription
    console.log(`Subscribing email: ${email}`);
    setIsSubscribed(true);
    setEmail('');
  };

  // Render footer link section
  const renderLinkSection = (
    title: string, 
    links: FooterLink[]
  ): React.ReactNode => (
    <div className="lg:col-span-1">
      <h3 className="font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.href}
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer section */}
      <div className="container mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand and newsletter section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-white">HealVirtue</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs">
              Dedicated to improving maternal and child health outcomes through innovation, education, and compassionate care.
            </p>
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-4">Subscribe to our newsletter</h3>
              {isSubscribed ? (
                <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-300 text-sm">
                    Thank you for subscribing! We'll keep you updated with our latest news.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="bg-gray-800 px-4 py-2 rounded-l-lg border-y border-l border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex-grow text-white"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="rounded-l-none rounded-r-lg border border-purple-600"
                  >
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          {renderLinkSection('Company', footerLinks.company)}
          {renderLinkSection('Services', footerLinks.services)}
          {renderLinkSection('Resources', footerLinks.resources)}
          {renderLinkSection('Legal', footerLinks.legal)}
        </div>
      </div>

      {/* Bottom copyright section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} HealVirtue. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <a
                href="#accessibility"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Accessibility
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="#sitemap"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;