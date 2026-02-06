
import React from 'react';
import { TrendingUp } from 'lucide-react';

const FooterContent = () => {
    return (
        <div className="bg-black text-white py-16 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-10 h-10 flex items-center justify-center transition-transform"
                                style={{
                                    borderRadius: '50px',
                                    boxShadow: '-2px -2px 4px 0px rgb(250, 251, 255), 2px 2px 4px 0px rgba(0, 125, 252, 0.15)',
                                    backgroundColor: 'rgb(236, 237, 241)'
                                }}
                            >
                                <img src="/logo.png" alt="TradePro Logo" className="w-6 h-6 object-contain" />
                            </div>
                            <span className="text-2xl font-bold">TradePro Elite</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Master Indian stock trading with our advanced paper trading platform.
                            Practice risk-free with ₹10 lakh virtual money.
                        </p>
                        <div className="flex gap-3">
                            {/* Twitter/X */}
                            <a
                                href="https://x.com/"
                                target="_blank"
                                rel="noopener"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'rgb(236, 237, 241)',
                                    borderRadius: '50px',
                                    boxShadow: '-2px -2px 4px 0px rgb(250, 251, 255), 2px 2px 4px 0px rgba(0, 125, 252, 0.15)'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: '20px', height: '20px', fill: 'black' }}>
                                    <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z"></path>
                                </svg>
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="https://linkedin.com/"
                                target="_blank"
                                rel="noopener"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'rgb(236, 237, 241)',
                                    borderRadius: '50px',
                                    boxShadow: '-2px -2px 4px 0px rgb(250, 251, 255), 2px 2px 4px 0px rgba(0, 125, 252, 0.15)'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: '20px', height: '20px', fill: 'black' }}>
                                    <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24ZM96,176a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0ZM88,92a12,12,0,1,1,12-12A12,12,0,0,1,88,92Zm96,84a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140Z"></path>
                                </svg>
                            </a>

                            {/* YouTube */}
                            <a
                                href="https://youtube.com/"
                                target="_blank"
                                rel="noopener"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'rgb(236, 237, 241)',
                                    borderRadius: '50px',
                                    boxShadow: '-2px -2px 4px 0px rgb(250, 251, 255), 2px 2px 4px 0px rgba(0, 125, 252, 0.15)'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: '20px', height: '20px', fill: 'black' }}>
                                    <path d="M234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-73.74,65-40,28A8,8,0,0,1,108,156V100a8,8,0,0,1,12.59-6.55l40,28a8,8,0,0,1,0,13.1Z"></path>
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a
                                href="https://instagram.com/"
                                target="_blank"
                                rel="noopener"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'rgb(236, 237, 241)',
                                    borderRadius: '50px',
                                    boxShadow: '-2px -2px 4px 0px rgb(250, 251, 255), 2px 2px 4px 0px rgba(0, 125, 252, 0.15)'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: '20px', height: '20px', fill: 'black' }}>
                                    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
                            <li><a href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</a></li>
                            <li><a href="/learn" className="text-gray-400 hover:text-white transition-colors">Learn</a></li>
                            <li><a href="/leaderboard" className="text-gray-400 hover:text-white transition-colors">Leaderboard</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2024 TradePro Elite. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Made with ❤️ for Indian traders
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FooterContent;
