/**
 * Adjacency Bonus Results Panel
 * 
 * Displays calculated adjacency bonuses for all districts in city range.
 */

import React, { useState } from 'react';
import {
  CityAdjacencyResult,
  DistrictAdjacencyResult,
  Yields,
  HexCoord,
  AdjacencyBonus,
} from '../../core';
import { DISTRICT_DATA } from '../../core/gameData';
import { YieldIcon, DistrictIcon } from './Icon';

interface AdjacencyPanelProps {
  result: CityAdjacencyResult | null;
  cityCenter: HexCoord | null;
  onCalculate: () => void;
}

const YieldBadge: React.FC<{ type: keyof Yields; value: number }> = ({ type, value }) => {
  if (value === 0) return null;
  
  const colorClasses: Record<keyof Yields, string> = {
    food: 'bg-green-500/20 text-green-400',
    production: 'bg-orange-500/20 text-orange-400',
    gold: 'bg-yellow-500/20 text-yellow-400',
    science: 'bg-blue-500/20 text-blue-400',
    culture: 'bg-purple-500/20 text-purple-400',
    faith: 'bg-gray-500/20 text-gray-400',
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colorClasses[type]}`}>
      <YieldIcon type={type} size="sm" /> {value}
    </span>
  );
};

const formatYields = (yields: Yields): React.ReactNode => {
  const items: React.ReactNode[] = [];
  
  (Object.keys(yields) as (keyof Yields)[]).forEach(key => {
    if (yields[key] > 0) {
      items.push(<YieldBadge key={key} type={key} value={yields[key]} />);
    }
  });
  
  if (items.length === 0) {
    return <span className="text-gray-500 text-sm">No bonuses</span>;
  }
  
  return <div className="flex flex-wrap gap-1">{items}</div>;
};

interface DistrictCardProps {
  district: DistrictAdjacencyResult;
  index: number;
}

const DistrictCard: React.FC<DistrictCardProps> = ({ district, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const districtInfo = DISTRICT_DATA[district.districtType];

  return (
    <div 
      className="border border-civ-border rounded-lg overflow-hidden animate-slide-up" 
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-civ-surface hover:bg-civ-hover transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <DistrictIcon type={district.districtType} size="lg" />
          <div>
            <span className="font-medium text-white">{districtInfo?.name || district.districtType}</span>
            <span className="ml-2 text-sm text-gray-500">
              ({district.tile.coord.q}, {district.tile.coord.r})
            </span>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-3 bg-civ-bg/50 border-t border-civ-border/50 space-y-3">
          <div>
            <div className="text-xs text-gray-400 mb-1">Total Bonus</div>
            {formatYields(district.totalBonus)}
          </div>

          {district.bonusBreakdown.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-2">Breakdown</div>
              <div className="space-y-1">
                {district.bonusBreakdown.map((bonus: AdjacencyBonus, idx: number) => {
                  const colorClasses: Record<keyof Yields, string> = {
                    food: 'bg-green-500/20 text-green-400',
                    production: 'bg-orange-500/20 text-orange-400',
                    gold: 'bg-yellow-500/20 text-yellow-400',
                    science: 'bg-blue-500/20 text-blue-400',
                    culture: 'bg-purple-500/20 text-purple-400',
                    faith: 'bg-gray-500/20 text-gray-400',
                  };
                  
                  return (
                    <div 
                      key={idx}
                      className="flex items-center justify-between text-sm py-1.5 px-2 bg-civ-surface/50 rounded"
                    >
                      <span className="text-gray-300">{bonus.source}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colorClasses[bonus.yieldType]}`}>
                        <YieldIcon type={bonus.yieldType} size="sm" /> +{bonus.amount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AdjacencyPanel: React.FC<AdjacencyPanelProps> = ({
  result,
  cityCenter,
  onCalculate,
}) => {
  if (!cityCenter) {
    return (
      <div className="panel">
        <div className="panel-header">Adjacency Bonuses</div>
        <div className="panel-body text-center text-gray-500 py-8">
          <DistrictIcon type="city_center" size="xl" className="mx-auto mb-3 opacity-50" />
          <p>Set a city center on the map to calculate adjacency bonuses</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="panel">
        <div className="panel-header flex items-center justify-between">
          <span>Adjacency Bonuses</span>
          <button onClick={onCalculate} className="btn-primary text-sm">
            Calculate
          </button>
        </div>
        <div className="panel-body text-center text-gray-500 py-8">
          <svg className="w-12 h-12 mx-auto mb-3 text-civ-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Click "Calculate" to analyze district bonuses
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Adjacency Bonuses</span>
          <span className="badge badge-neutral">{result.districts.length} districts</span>
        </div>
        <button onClick={onCalculate} className="btn-secondary text-sm">
          Recalculate
        </button>
      </div>

      <div className="panel-body space-y-4">
        {/* Total Yields Summary */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Science', key: 'science' as keyof Yields },
            { label: 'Culture', key: 'culture' as keyof Yields },
            { label: 'Faith', key: 'faith' as keyof Yields },
            { label: 'Gold', key: 'gold' as keyof Yields },
            { label: 'Production', key: 'production' as keyof Yields },
            { label: 'Food', key: 'food' as keyof Yields },
          ].map(({ label, key }) => (
            <div 
              key={key}
              className="p-2 bg-civ-surface rounded border border-civ-border/50 text-center"
            >
              <YieldIcon type={key} size="lg" className="mx-auto" />
              <div className="text-xl font-bold text-white mt-1">{result.totalYields[key]}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        {/* District Details */}
        {result.districts.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No specialty districts in city range. Add districts to see adjacency bonuses.
          </div>
        ) : (
          <div className="space-y-2">
            {result.districts.map((district: DistrictAdjacencyResult, idx: number) => (
              <DistrictCard key={idx} district={district} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
