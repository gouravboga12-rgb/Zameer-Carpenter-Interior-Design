import { 
  Home, CookingPot, Hammer, DoorOpen, DoorClosed, Tv, Building2, 
  Wrench, PackageOpen, Trash2, Sofa, Bed, Layers, Sparkles, 
  ShieldCheck, Boxes, Paintbrush, Scissors, Ruler, Truck,
  Lamp, Armchair, Shield, Flame, Compass, PackageCheck, Construction
} from 'lucide-react';

export const AVAILABLE_SERVICE_ICONS = [
  { name: 'Home', label: 'Complete Home / Interiors', icon: Home },
  { name: 'Wrench', label: 'Furniture Assembly & Tools', icon: Wrench },
  { name: 'PackageOpen', label: 'Furniture Disassembly', icon: PackageOpen },
  { name: 'DoorOpen', label: 'Door Fitting & Wardrobes', icon: DoorOpen },
  { name: 'DoorClosed', label: 'Doors & Safety Gates', icon: DoorClosed },
  { name: 'Trash2', label: 'Old Interior & Scrap Removal', icon: Trash2 },
  { name: 'CookingPot', label: 'Modular Kitchens', icon: CookingPot },
  { name: 'Hammer', label: 'Master Carpentry & Woodcraft', icon: Hammer },
  { name: 'Tv', label: 'TV Units & Entertainment', icon: Tv },
  { name: 'Building2', label: 'Commercial & Office Fit-Out', icon: Building2 },
  { name: 'Sofa', label: 'Living Room & Seating', icon: Sofa },
  { name: 'Bed', label: 'Bedroom & Hydraulic Beds', icon: Bed },
  { name: 'Layers', label: 'False Ceilings & Paneling', icon: Layers },
  { name: 'Boxes', label: 'Modular Cabinets & Storage', icon: Boxes },
  { name: 'Paintbrush', label: 'PU Polish & Surface Finishes', icon: Paintbrush },
  { name: 'Ruler', label: 'Laser Measurement & Layout', icon: Ruler },
  { name: 'Truck', label: 'Relocation & On-Site Handover', icon: Truck },
  { name: 'Sparkles', label: 'Luxury & Bespoke Aesthetic', icon: Sparkles },
  { name: 'ShieldCheck', label: 'Certified & Termite Proof', icon: ShieldCheck },
  { name: 'Construction', label: 'Renovation & Demolition', icon: Construction }
];

export const SERVICE_ICONS_MAP = {
  Home,
  Wrench,
  PackageOpen,
  DoorOpen,
  DoorClosed,
  Trash2,
  CookingPot,
  Hammer,
  Tv,
  Building2,
  Sofa,
  Bed,
  Layers,
  Boxes,
  Paintbrush,
  Ruler,
  Truck,
  Sparkles,
  ShieldCheck,
  Construction,
  Lamp,
  Armchair,
  Shield,
  Flame,
  Compass,
  PackageCheck
};

export function getServiceIcon(iconName) {
  return SERVICE_ICONS_MAP[iconName] || Home;
}
