import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export function Footer({ className, ...props }) {
  return (
    <footer
      className={cn(
        'border-t border-paper/10 bg-ink',
        'bg-[radial-gradient(35%_128px_at_50%_0%,theme(colors.cobalt/10),transparent)]',
        className
      )}
      {...props}
    >
      <div className="relative mx-auto max-w-5xl px-4">
        <div className="relative grid grid-cols-1 border-x border-paper/10 md:grid-cols-4 md:divide-x md:divide-paper/10">
          <div className="footer-col">
            <SocialCard title="Facebook" href="#" />
            <LinksGroup title="About Us" links={[{ title: 'Pricing', href: '#' }, { title: 'Testimonials', href: '#' }, { title: 'FAQs', href: '#' }, { title: 'Contact Us', href: '#' }, { title: 'Blog', href: '#' }]} />
          </div>
          <div className="footer-col" style={{'--delay': '0.1s'}}>
            <SocialCard title="Youtube" href="#" />
            <LinksGroup title="Support" links={[{ title: 'Help Center', href: '#' }, { title: 'Terms', href: '#' }, { title: 'Privacy', href: '#' }, { title: 'Security', href: '#' }, { title: 'Cookie Policy', href: '#' }]} />
          </div>
          <div className="footer-col" style={{'--delay': '0.2s'}}>
            <SocialCard title="Twitter" href="#" />
            <LinksGroup title="Community" links={[{ title: 'Forum', href: '#' }, { title: 'Events', href: '#' }, { title: 'Partners', href: '#' }, { title: 'Affiliates', href: '#' }, { title: 'Career', href: '#' }]} />
          </div>
          <div className="footer-col" style={{'--delay': '0.3s'}}>
            <SocialCard title="Instagram" href="#" />
            <LinksGroup title="Legal" links={[{ title: 'Investors', href: '#' }, { title: 'Terms of Use', href: '#' }, { title: 'Privacy Policy', href: '#' }, { title: 'Cookie Policy', href: '#' }]} />
          </div>
        </div>
      </div>
      <div className="flex justify-center border-t border-paper/10 p-3">
        <p className="text-paper/60 text-xs">
          © {new Date().getFullYear()} Sports Auction. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function LinksGroup({ title, links }) {
  return (
    <div className="p-4">
      <h3 className="text-paper/75 mt-2 mb-4 text-xs font-semibold tracking-wider uppercase">
        {title}
      </h3>
      <ul>
        {links.map((link) => (
          <li key={link.title} className="mb-2">
            <a href={link.href} className="text-paper/60 hover:text-paper text-sm transition-all duration-200 hover:-translate-y-px">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialCard({ title, href }) {
  return (
    <a href={href} className="group text-paper hover:bg-paper/5 flex items-center justify-between border-b border-paper/10 p-4 text-sm transition-colors duration-200 md:border-t-0">
      <span className="font-semibold">{title}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  );
}