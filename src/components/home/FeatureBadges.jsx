import React from 'react';
import { Hammer, Boxes, Sparkles, Clock, ShieldCheck } from 'lucide-react';

const BADGES = [
  {
    icon: Hammer,
    title: "100% Customized Carpentry",
    desc: "Millimeter-precision master woodwork"
  },
  {
    icon: Boxes,
    title: "Photorealistic 3D Renders",
    desc: "HD preview before execution"
  },
  {
    icon: Sparkles,
    title: "Factory-Finish Modular Solutions",
    desc: "German fittings & BWP marine ply"
  },
  {
    icon: Clock,
    title: "Guaranteed On-Time Handover",
    desc: "Strict project milestones & warranty"
  }
];

export default function FeatureBadges() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {BADGES.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className="bg-luxury-card/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-luxury-gold/30 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-luxury-gold/15 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold shrink-0 group-hover:bg-luxury-gold group-hover:text-luxury-walnut transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-luxury-walnut font-heading tracking-tight leading-snug group-hover:text-luxury-gold-dark transition-colors">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-luxury-muted mt-0.5 leading-normal">
                    {badge.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
