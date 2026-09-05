import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';

const BASE_DOMAIN = 'https://zameerinteriorcarpenter.com';

const ROUTE_SEO = {
  '/': {
    title: 'Zameer Carpenter Interior Design | Luxury Turnkey Interiors & Woodcraft Hyderabad',
    description: "Top-rated interior designer and bespoke carpenter in Hyderabad (Tolichowki, Shaikpet, Banjara Hills, Jubilee Hills). Luxury turnkey home interiors, modular kitchens, sliding wardrobes, and master woodworking.",
    keywords: 'Interior Designers in Hyderabad, Best Interior Designer Hyderabad, Carpenter in Hyderabad, Custom Carpentry Hyderabad, Modular Kitchen Hyderabad, Custom Wardrobes Hyderabad, Turnkey Home Interiors Hyderabad, Luxury Interiors Tolichowki, Carpenter Shaikpet, Woodwork Hyderabad, Zameer Interior Carpenter'
  },
  '/services': {
    title: 'Interior Design & Carpentry Services | Zameer Carpenter Hyderabad',
    description: 'Explore our full suite of luxury interior services: Complete home interiors, modular kitchens, custom wardrobes, bespoke woodcraft, TV wall paneling, and commercial renovations in Hyderabad.',
    keywords: 'Interior Design Services Hyderabad, Modular Kitchens Hyderabad, Custom Wardrobe Design, TV Unit Paneling, Woodcraft Tolichowki'
  },
  '/projects': {
    title: 'Recent Projects & Video Walkthroughs | Zameer Carpenter Interior Design',
    description: 'Browse real photographs and 4K video walkthroughs of completed turnkey interiors, modular kitchens, master bedroom suites, and custom carpentry across Hyderabad.',
    keywords: 'Interior Design Projects Hyderabad, Interior Video Walkthroughs Hyderabad, Completed Turnkey Interiors Tolichowki, Real Woodcraft Photos'
  },
  '/recent-projects': {
    title: 'Recent Projects & Video Walkthroughs | Zameer Carpenter Interior Design',
    description: 'Browse real photographs and 4K video walkthroughs of completed turnkey interiors, modular kitchens, master bedroom suites, and custom carpentry across Hyderabad.',
    keywords: 'Interior Design Projects Hyderabad, Interior Video Walkthroughs Hyderabad, Completed Turnkey Interiors Tolichowki, Real Woodcraft Photos'
  },
  '/about': {
    title: 'About Us | 15+ Years Master Carpentry & Interior Heritage Hyderabad',
    description: 'Meet Zameer and our seasoned team of master carpenters and interior designers based in Tolichowki, Hyderabad. Dedicated to millimeter precision and honest craftsmanship.',
    keywords: 'About Zameer Interior Designer, Master Carpenter Hyderabad, Interior Studio Tolichowki, Bespoke Woodworking Heritage'
  },
  '/contact': {
    title: 'Contact Us | Book Free 3D Design & Site Measurement Hyderabad',
    description: 'Get in touch with Zameer Carpenter Interior Design. Schedule a free on-site laser measurement and 3D consultation in Tolichowki, Shaikpet, and across Hyderabad.',
    keywords: 'Contact Interior Designer Hyderabad, Book Carpenter Consultation, Interior Designer Tolichowki Phone Number, Free 3D Design Session'
  }
};

export default function SEOHead() {
  const location = useLocation();
  const { services } = useAdminData();

  useEffect(() => {
    const pathname = location.pathname.replace(/\/$/, '') || '/';
    let seo = ROUTE_SEO[pathname];

    // Handle dynamic service vertical pages: /services/:serviceId
    if (!seo && pathname.startsWith('/services/')) {
      const parts = pathname.split('/');
      const serviceId = parts[2];
      const service = (services || []).find(s => s.id === serviceId);

      if (service) {
        seo = {
          title: `${service.title} in Hyderabad | Zameer Carpenter Interior Design`,
          description: `${service.description || service.tagline || 'Custom luxury interior design and precision carpentry in Hyderabad.'} Get a free 3D design consultation in Tolichowki & Hyderabad.`,
          keywords: `${service.title}, ${service.shortTitle} Hyderabad, Carpenter ${service.shortTitle}, Turnkey ${service.title} Tolichowki, ${service.title} Banjara Hills`
        };
      }
    }

    // Default fallback
    if (!seo) {
      seo = ROUTE_SEO['/'];
    }

    const fullUrl = `${BASE_DOMAIN}${location.pathname}`;

    // 1. Update Document Title
    document.title = seo.title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.description);

    // 3. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && seo.keywords) {
      metaKeywords.setAttribute('content', seo.keywords);
    }

    // 4. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // 5. Update Open Graph Meta
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', fullUrl);

    // 6. Update Twitter Meta
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', seo.title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', seo.description);

    const twUrl = document.querySelector('meta[name="twitter:url"]');
    if (twUrl) twUrl.setAttribute('content', fullUrl);

  }, [location.pathname, services]);

  return null;
}
