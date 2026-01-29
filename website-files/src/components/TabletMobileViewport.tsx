import * as React from "react";

export function TabletMobileViewport() {
  React.useEffect(() => {
    const ensureMeta = () => {
      let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        document.head.appendChild(meta);
      }
      return meta!;
    };

    const meta = ensureMeta();

    const apply = () => {
      const ua = navigator.userAgent || '';
      const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);
      const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
      const isTablet = isIPad || isAndroidTablet;

      if (isTablet) {
        meta.setAttribute('content', 'width=480, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
      } else {
        meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
      }
    };

    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
    };
  }, []);

  return null;
}
