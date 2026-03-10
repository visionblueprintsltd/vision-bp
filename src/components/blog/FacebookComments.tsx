import { useEffect } from "react";

interface FacebookCommentsProps {
  slug: string;
}

export const FacebookComments = ({ slug }: FacebookCommentsProps) => {
  const url = `${window.location.origin}/blog/${slug}`;

  useEffect(() => {
    // Load Facebook SDK
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      (window as any).fbAsyncInit = function() {
        window.FB.init({
          appId: 'hgjfkasjkkfksdfhksjdhfjkshjkdhjk',
          xfbml: true,
          version: 'v18.0'
        });
      };
      const script = document.createElement('script');
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [url]);

  return (
    <div className="mt-12 p-6 bg-white rounded-lg border border-slate-200">
      <h3 className="text-xl font-bold mb-6">Discussion</h3>
      <div 
        className="fb-comments" 
        data-href={url} 
        data-width="100%" 
        data-numposts="5"
      ></div>
    </div>
  );
};