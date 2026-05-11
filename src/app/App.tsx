import { Suspense } from "react";
import { RouterProvider } from 'react-router';
import { router } from './routes';
import ColorThemeSelector from "../features/shared/ui/ColorThemeSelector";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="text-center">
          <div className="size-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <RouterProvider router={router} />
      <ColorThemeSelector />
    </Suspense>
  );
}