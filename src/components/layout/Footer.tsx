import { Link } from "react-router-dom";
import { BookOpen, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>© {new Date().getFullYear()} TradePro Elite. All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/research" 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Academic Research Validation
          </Link>
          
          <Link 
            to="/about" 
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            About
          </Link>
          
          <Link 
            to="/contact" 
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
