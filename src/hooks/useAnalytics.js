import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Simular envío de datos a analytics
    const pageView = {
      path: location.pathname,
      timestamp: new Date().toISOString(),
      title: document.title
    };

    // Guardar en localStorage para analytics local
    const analytics = JSON.parse(localStorage.getItem('pageViews') || '[]');
    localStorage.setItem('pageViews', JSON.stringify([pageView, ...analytics.slice(0, 100)]));

    // Simular evento de Google Analytics
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname,
      });
    }
  }, [location]);

  // Función para trackear eventos
  const trackEvent = (category, action, label) => {
    const event = {
      category,
      action,
      label,
      timestamp: new Date().toISOString()
    };

    const events = JSON.parse(localStorage.getItem('userEvents') || '[]');
    localStorage.setItem('userEvents', JSON.stringify([event, ...events.slice(0, 100)]));

    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
  };

  return { trackEvent };
}