/**
 * Centralized Pricing Matrix & Estimator Configuration
 * Designed for easy future API integration or backend administration.
 */

export const PROPERTY_TYPES = [
  { id: "1BHK", label: "1 BHK", approxArea: "600 - 800 sq.ft", baseMultiplier: 1.0 },
  { id: "2BHK", label: "2 BHK", approxArea: "950 - 1,250 sq.ft", baseMultiplier: 1.45 },
  { id: "3BHK", label: "3 BHK", approxArea: "1,400 - 1,900 sq.ft", baseMultiplier: 1.95 },
  { id: "4BHK", label: "4 BHK", approxArea: "2,200 - 3,000 sq.ft", baseMultiplier: 2.55 },
  { id: "Villa", label: "Luxury Villa", approxArea: "3,200 - 5,500 sq.ft", baseMultiplier: 3.6 },
  { id: "Commercial", label: "Commercial / Office", approxArea: "1,000 - 4,000 sq.ft", baseMultiplier: 1.8 }
];

export const SCOPES = [
  {
    id: "full_interior",
    label: "Full Interior",
    tagline: "Turnkey woodwork, modular kitchen, wardrobes, TV units, false ceilings, lighting & civil fixes",
    baseMin: 320000,
    baseMax: 450000,
    deliverables: [
      "Complete 3D photorealistic visualization",
      "Modular Kitchen with BWP Marine Plywood",
      "Floor-to-ceiling wardrobes in all bedrooms",
      "Designer TV wall console with fluted louvers",
      "Gypsum false ceiling with cove LED strips",
      "Main door safety woodwork & shoe rack"
    ]
  },
  {
    id: "modular_kitchen",
    label: "Modular Kitchen",
    tagline: "Custom BWP marine kitchen with tandem drawers, quartz counter, and profile lighting",
    baseMin: 140000,
    baseMax: 210000,
    deliverables: [
      "3D modular layout (L-shape / Parallel / Island)",
      "IS:710 Marine Boiling Water Proof Carcass",
      "High-gloss acrylic or anti-scratch laminate shutters",
      "German soft-close hinges & tandem box drawers",
      "Chimney & cooktop integration provision"
    ]
  },
  {
    id: "wardrobes_tv_unit",
    label: "Wardrobes & TV Unit",
    tagline: "Master bedroom wardrobes, sliding lofts, and architectural living room TV wall",
    baseMin: 180000,
    baseMax: 260000,
    deliverables: [
      "Full-height sliding / swing wardrobes with internal organizers",
      "Backlit sensor LED strip profiles inside closets",
      "Fluted wooden charcoal & marble sheet TV wall paneling",
      "Floating cantilever entertainment console"
    ]
  },
  {
    id: "carpentry_only",
    label: "Carpentry Only",
    tagline: "Bespoke onsite carpentry, custom furniture, main doors, and structural woodwork",
    baseMin: 110000,
    baseMax: 170000,
    deliverables: [
      "Master carpenter on-site execution",
      "Teak / hardwood main frames, arches & safety doors",
      "Custom bed frames, dining sets & partition screens",
      "Precision millimeter-level hardware fittings"
    ]
  },
  {
    id: "renovation",
    label: "Renovation",
    tagline: "Upgrading existing spaces, re-laminating cabinets, civil alterations & modernization",
    baseMin: 160000,
    baseMax: 240000,
    deliverables: [
      "Dismantling & safe disposal of old woodwork",
      "Cabinet modernization with soft-close upgrades",
      "Wall panelling over existing structural plaster",
      "Electrical rerouting for ambient cove lighting"
    ]
  }
];

export const FINISH_TIERS = [
  {
    id: "essential",
    label: "Essential",
    badge: "Cost-Effective Quality",
    multiplier: 1.0,
    description: "Commercial MR-Grade Plywood, 0.8mm Premium Matte/Gloss Laminates, Ebco/Godrej hardware fittings, 5-Year Craftsmanship Warranty.",
    specs: [
      "IS:303 Commercial MR Plywood",
      "0.8mm Matte/Suede finish laminates",
      "Ebco / Standard soft-close hinges",
      "Standard profile aluminium handles"
    ]
  },
  {
    id: "premium",
    label: "Premium",
    badge: "Most Popular",
    multiplier: 1.38,
    isPopular: true,
    description: "IS:710 Marine-Grade BWP 100% Waterproof Plywood, 1mm High-Gloss/Acrylic laminates, Hettich/Hafele soft-close fittings, 10-Year Warranty.",
    specs: [
      "IS:710 Marine-Grade 100% BWP Plywood",
      "1mm High-Gloss / Acrylic / Fabric textured laminates",
      "Hettich / Hafele German soft-close tandem boxes",
      "Concealed G-profile gold/black handles & LED channels"
    ]
  },
  {
    id: "ultra_luxury",
    label: "Ultra-Luxury",
    badge: "Elite Architectural Finish",
    multiplier: 1.85,
    description: "Marine BWP Core with Natural Teak Veneer / Italian PU Gloss Finish, Statuario Marble backdrops, Blum motion hardware, 15-Year Warranty.",
    specs: [
      "Bespoke Natural Wood Veneer & High-Polyurethane (PU) Polish",
      "Statuario Marble & Backlit Fluted Charcoal Louvers",
      "Blum Aventos lift-ups & motorized sensor lighting",
      "Solid Brass / Titanium Gold custom hardware trims"
    ]
  }
];

/**
 * Helper to calculate min and max indicative price range
 */
export function calculateEstimate(propertyTypeId, scopeId, tierId) {
  const property = PROPERTY_TYPES.find((p) => p.id === propertyTypeId) || PROPERTY_TYPES[1];
  const scope = SCOPES.find((s) => s.id === scopeId) || SCOPES[0];
  const tier = FINISH_TIERS.find((t) => t.id === tierId) || FINISH_TIERS[1];

  const minRaw = Math.round(scope.baseMin * property.baseMultiplier * tier.multiplier);
  const maxRaw = Math.round(scope.baseMax * property.baseMultiplier * tier.multiplier);

  // Round to nearest 5,000 for clean display
  const min = Math.round(minRaw / 5000) * 5000;
  const max = Math.round(maxRaw / 5000) * 5000;

  return {
    property,
    scope,
    tier,
    min,
    max,
    indicativeLabel: "Indicative project estimate (inclusive of materials, master carpentry, and turnkey installation)"
  };
}
