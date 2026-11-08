import React from 'react';

export type AdSlotType = '160x300' | '160x600' | 'direct-link';

interface AdUnitProps {
  type: AdSlotType;
  className?: string;
  showBadge?: boolean;
}

export const DIRECT_MONETIZE_URL = 'https://arwf.org/4/2e8a380eb27ab0309e94886c9658f497';

const AD_CONFIGS = {
  '160x300': {
    width: 160,
    height: 300,
    key: '14ae54b5f2861fe95e852c9e08437c57',
    scriptUrl: 'https://bicea.org/22/14ae54b5f2861fe95e852c9e08437c57',
  },
  '160x600': {
    width: 160,
    height: 600,
    key: '3f2fa248d5fd3f2ad1a404a031454874',
    scriptUrl: 'https://bicea.org/22/3f2fa248d5fd3f2ad1a404a031454874',
  },
};

export const AdUnit: React.FC<AdUnitProps> = ({
  type,
  className = '',
  showBadge = true,
}) => {
  if (type === 'direct-link') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {showBadge && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
            Sponsored / اشتہار
          </span>
        )}
        <a
          href={DIRECT_MONETIZE_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group block w-full max-w-sm p-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-md transition-all hover:scale-[1.02] text-center"
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1 opacity-90">
            <span>Special Offer</span>
            <span className="font-urdu-typing text-[11px]">خصوصی پیشکش</span>
          </div>
          <p className="text-sm font-semibold tracking-tight">
            Click Here to Explore Sponsored Deals &amp; Rewards
          </p>
        </a>
      </div>
    );
  }

  const config = AD_CONFIGS[type];
  if (!config) return null;

  // Build the sandboxed iframe srcdoc so atOptions executes reliably in isolation
  const iframeContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: transparent;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${config.key}',
      'format' : 'iframe',
      'height' : ${config.height},
      'width' : ${config.width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="${config.scriptUrl}"></script>
</body>
</html>`;

  return (
    <div
      className={`flex flex-col items-center justify-center p-1.5 bg-slate-100/80 border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden select-none ${className}`}
      style={{ width: `${config.width + 12}px`, minHeight: `${config.height + (showBadge ? 24 : 12)}px` }}
    >
      {showBadge && (
        <div className="w-full flex items-center justify-between px-1 mb-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Ad</span>
          <span className="font-urdu-typing text-[10px] text-slate-400">اشتہار</span>
        </div>
      )}
      <iframe
        title={`Advertisement ${config.width}x${config.height}`}
        srcDoc={iframeContent}
        width={config.width}
        height={config.height}
        scrolling="no"
        frameBorder="0"
        className="rounded-lg shadow-2xs border-0 bg-white"
        style={{ width: `${config.width}px`, height: `${config.height}px`, overflow: 'hidden' }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      />
    </div>
  );
};
