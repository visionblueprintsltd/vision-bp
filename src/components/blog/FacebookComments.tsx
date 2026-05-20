import { useEffect, useState } from "react";

interface FacebookCommentsProps {
  slug: string;
}

export const FacebookComments = ({ slug }: FacebookCommentsProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const url = `${window.location.origin}/blog/${slug}`;

  useEffect(() => {
    const loadFacebookSDK = () => {
      if (window.FB) {
        try {
          window.FB.XFBML.parse();
          setIsLoaded(true);
        } catch (e) {
          console.error("FB XFBML parse error:", e);
        }
        return;
      }

      (window as any).fbAsyncInit = function() {
        try {
          window.FB.init({
            appId: '892743912648102', // Use a placeholder or valid app ID
            xfbml: true,
            version: 'v18.0'
          });
          setIsLoaded(true);
        } catch (e) {
          console.error("FB Init error:", e);
        }
      };

      // Check if script already exists
      if (!document.getElementById('facebook-jssdk')) {
        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.async = true;
        script.defer = true;
        script.onerror = () => console.error("Facebook SDK load error");
        document.body.appendChild(script);
      } else {
        setIsLoaded(true);
      }
    };

    loadFacebookSDK();
  }, [url]);

  return (
    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Discussion</h3>
          <p className="text-sm text-slate-500">Join the conversation via Facebook</p>
        </div>
      </div>
      
      <div 
        className="fb-comments" 
        data-href={url} 
        data-width="100%" 
        data-numposts="5"
        data-order-by="reverse_time"
      ></div>
      
      {!isLoaded && (
        <div className="py-10 text-center text-slate-400 text-sm animate-pulse">
          Loading discussion board...
        </div>
      )}
    </div>
  );
};