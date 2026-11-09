import React, { useEffect, useRef } from 'react';

export interface AdBannerProps {
  size: '160x300' | '160x600';
  className?: string;
}

export function AdBanner({ size, className = '' }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const config = size === '160x300'
    ? {
        key: '14ae54b5f2861fe95e852c9e08437c57',
        height: 300,
        width: 160,
        src: 'https://bicea.org/22/14ae54b5f2861fe95e852c9e08437c57',
      }
    : {
        key: '3f2fa248d5fd3f2ad1a404a031454874',
        height: 600,
        width: 160,
        src: 'https://bicea.org/22/3f2fa248d5fd3f2ad1a404a031454874',
      };

  useEffect(() => {
    if (size === '160x300') {
      (window as any).atOptions = {
        key: '14ae54b5f2861fe95e852c9e08437c57',
        format: 'iframe',
        height: 300,
        width: 160,
        params: {},
      };
    } else {
      (window as any).atOptions = {
        key: '3f2fa248d5fd3f2ad1a404a031454874',
        format: 'iframe',
        height: 600,
        width: 160,
        params: {},
      };
    }
  }, [size]);

  // Sandboxed iframe srcdoc ensures safe and reliable execution in React
  const iframeHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; overflow: hidden; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key': '${config.key}',
      'format': 'iframe',
      'height': ${config.height},
      'width': ${config.width},
      'params': {}
    };
  </script>
  <script type="text/javascript" src="${config.src}"></script>
</body>
</html>`;

  return (
    <div
      ref={containerRef}
      className={`ad-container flex flex-col items-center justify-center p-2 rounded-2xl bg-white/95 border border-slate-200/90 shadow-sm select-none ${className}`}
      style={{ width: `${config.width + 16}px`, minHeight: `${config.height + 32}px` }}
    >
      <div className="w-full flex items-center justify-between px-1 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
        <span>Sponsored</span>
        <span className="font-urdu-typing text-[11px] text-slate-400">اشتہار</span>
      </div>

      <iframe
        title={`Adsterra ${size}`}
        srcDoc={iframeHtml}
        width={config.width}
        height={config.height}
        scrolling="no"
        frameBorder="0"
        className="rounded-lg bg-slate-50 border-0"
        style={{ width: `${config.width}px`, height: `${config.height}px`, overflow: 'hidden' }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      />
    </div>
  );
}
