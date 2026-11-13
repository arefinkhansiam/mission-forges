import React, { useState } from 'react';

interface PremiumHUDProps {
  currentBudget: number;
  maxBudget: number;
  deltaV: number;
  onSystemTweak: (gravityFactor: number, activeHex: string) => void;
  onClose?: () => void;
}

export const PremiumMissionHUD: React.FC<PremiumHUDProps> = ({
  currentBudget,
  maxBudget,
  deltaV,
  onSystemTweak,
  onClose
}) => {
  const [accentColor, setAccentColor] = useState<string>('#00f3ff');
  const [fieldLift, setFieldLift] = useState<number>(0.45);
  
  const budgetPercentage = (currentBudget / maxBudget) * 100;
  const isOverBudget = currentBudget > maxBudget;

  const handleLiftAdjustment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFieldLift(val);
    onSystemTweak(val, accentColor);
  };

  return (
    <div style={{
      position: 'absolute', top: '24px', right: '24px', width: '340px',
      background: 'linear-gradient(135deg, rgba(4, 8, 20, 0.95) 0%, rgba(12, 19, 43, 0.85) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)', border: `1px solid ${accentColor}33`,
      boxShadow: `0 12px 40px 0 rgba(0, 243, 255, 0.12), inset 0 0 16px ${accentColor}10`,
      borderRadius: '16px', padding: '24px', color: '#f0f4f8',
      fontFamily: '"SF Pro Display", "-apple-system", monospace',
      letterSpacing: '0.5px',
      zIndex: 40,
    }}>
      {/* Telemetry Indicator Node */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '2px' }}>
          Vector Control System
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '0 4px',
                lineHeight: 1,
              }}
              title="Close Panel"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Anti-Grav Slider Component */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '10px', color: '#94a3b8' }}>
          <span>Anti-Gravity Amplitude</span>
          <span style={{ fontFamily: 'monospace', color: accentColor, fontWeight: 'bold' }}>{fieldLift.toFixed(2)}g</span>
        </div>
        <input 
          type="range" min="0" max="1" step="0.01" value={fieldLift} onChange={handleLiftAdjustment}
          style={{ width: '100%', height: '4px', borderRadius: '2px', accentColor: accentColor, background: 'rgba(255,255,255,0.1)', outline: 'none', cursor: 'pointer' }}
        />
      </div>

      {/* Budget Matrix Meter */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
          <span style={{ color: '#94a3b8' }}>Staging Expenditure</span>
          <span style={{ color: isOverBudget ? '#ef4444' : '#10b981', fontWeight: 600 }}>
            {currentBudget.toLocaleString()} / {maxBudget.toLocaleString()} B
          </span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(budgetPercentage, 100)}%`, height: '100%', backgroundColor: isOverBudget ? '#ef4444' : accentColor, boxShadow: `0 0 10px ${isOverBudget ? '#ef4444' : accentColor}`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Real-time Delta-V Telemetry Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Est. Delta-V</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>{deltaV} m/s</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Field Status</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#10b981', marginTop: '2px' }}>ONLINE</div>
        </div>
      </div>

      {/* Color Matrix Terminal Spectrum Swapper */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
        <span>Interface Spectrum Link</span>
        <input 
          type="color" value={accentColor} onChange={(e) => { setAccentColor(e.target.value); onSystemTweak(fieldLift, e.target.value); }}
          style={{ border: 'none', width: '24px', height: '24px', padding: 0, backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '4px' }}
        />
      </div>
    </div>
  );
};

export default PremiumMissionHUD;
