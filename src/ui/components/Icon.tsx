/**
 * Icon Component
 * 
 * Renders Civ6 icons from the wiki with fallback to emoji.
 */

import React, { useState } from 'react';
import {
  YIELD_ICONS,
  DISTRICT_ICONS,
  RESOURCE_ICONS,
  FEATURE_ICONS,
  TERRAIN_ICONS,
  STAT_ICONS,
} from '../../core/icons';

interface IconProps {
  src: string;
  alt: string;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

const SIZE_MAP = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const Icon: React.FC<IconProps> = ({
  src,
  alt,
  size = 'md',
  fallback,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size];

  // If no src or error occurred, show fallback
  if (!src || hasError) {
    if (fallback) {
      return <span className={className} title={alt}>{fallback}</span>;
    }
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      title={alt}
      width={pixelSize}
      height={pixelSize}
      className={`inline-block ${className}`}
      style={{ imageRendering: 'pixelated' }}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};

// ============================================================================
// SPECIALIZED ICON COMPONENTS
// ============================================================================

interface YieldIconProps {
  type: 'food' | 'production' | 'gold' | 'science' | 'culture' | 'faith';
  size?: IconProps['size'];
  className?: string;
}

export const YieldIcon: React.FC<YieldIconProps> = ({ type, size = 'md', className }) => (
  <Icon
    src={YIELD_ICONS[type]}
    alt={type.charAt(0).toUpperCase() + type.slice(1)}
    size={size}
    className={className}
  />
);

interface DistrictIconProps {
  type: string;
  size?: IconProps['size'];
  className?: string;
}

const DISTRICT_FALLBACKS: Record<string, string> = {
  city_center: '🏛️',
  campus: '📚',
  holy_site: '⛪',
  theater_square: '🎭',
  commercial_hub: '💰',
  harbor: '⚓',
  industrial_zone: '🏭',
  entertainment_complex: '🎪',
  water_park: '🏊',
  aqueduct: '🌊',
  neighborhood: '🏘️',
  spaceport: '🚀',
  aerodrome: '✈️',
  encampment: '⚔️',
  government_plaza: '🏛️',
  diplomatic_quarter: '🤝',
  preserve: '🌿',
  dam: '🌊',
  canal: '🚢',
  none: '',
};

export const DistrictIcon: React.FC<DistrictIconProps> = ({ type, size = 'md', className }) => {
  const iconKey = type as keyof typeof DISTRICT_ICONS;
  const src = DISTRICT_ICONS[iconKey] || DISTRICT_ICONS.district;
  const fallback = DISTRICT_FALLBACKS[type] || '🔷';
  
  return (
    <Icon
      src={src}
      alt={type.replace(/_/g, ' ')}
      size={size}
      fallback={fallback}
      className={className}
    />
  );
};

interface ResourceIconProps {
  type: string;
  size?: IconProps['size'];
  className?: string;
}

export const ResourceIcon: React.FC<ResourceIconProps> = ({ type, size = 'md', className }) => {
  const iconKey = type as keyof typeof RESOURCE_ICONS;
  const src = RESOURCE_ICONS[iconKey];
  
  if (!src || type === 'none') return null;
  
  return (
    <Icon
      src={src}
      alt={type.replace(/_/g, ' ')}
      size={size}
      fallback="💎"
      className={className}
    />
  );
};

interface FeatureIconProps {
  type: string;
  size?: IconProps['size'];
  className?: string;
}

const FEATURE_FALLBACKS: Record<string, string> = {
  forest: '🌲',
  jungle: '🌴',
  marsh: '🌿',
  floodplains: '🌊',
  oasis: '🏝️',
  reef: '🪸',
  ice: '🧊',
  volcano: '🌋',
  geothermal_fissure: '♨️',
};

export const FeatureIcon: React.FC<FeatureIconProps> = ({ type, size = 'md', className }) => {
  const iconKey = type as keyof typeof FEATURE_ICONS;
  const src = FEATURE_ICONS[iconKey];
  
  if (!src || type === 'none') return null;
  
  return (
    <Icon
      src={src}
      alt={type.replace(/_/g, ' ')}
      size={size}
      fallback={FEATURE_FALLBACKS[type] || '🌿'}
      className={className}
    />
  );
};

interface TerrainIconProps {
  terrain: string;
  modifier?: string;
  size?: IconProps['size'];
  className?: string;
}

export const TerrainIcon: React.FC<TerrainIconProps> = ({ terrain, modifier, size = 'md', className }) => {
  let iconKey = terrain;
  if (modifier === 'hills') {
    iconKey = `${terrain}_hills`;
  } else if (modifier === 'mountain') {
    iconKey = 'mountain';
  }
  
  const src = TERRAIN_ICONS[iconKey as keyof typeof TERRAIN_ICONS];
  
  if (!src) return null;
  
  return (
    <Icon
      src={src}
      alt={`${terrain} ${modifier || ''}`.trim()}
      size={size}
      fallback="🗺️"
      className={className}
    />
  );
};

interface StatIconProps {
  type: keyof typeof STAT_ICONS;
  size?: IconProps['size'];
  className?: string;
}

export const StatIcon: React.FC<StatIconProps> = ({ type, size = 'md', className }) => (
  <Icon
    src={STAT_ICONS[type]}
    alt={type}
    size={size}
    fallback="📊"
    className={className}
  />
);

