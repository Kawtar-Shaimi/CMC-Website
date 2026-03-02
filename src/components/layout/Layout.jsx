// src/components/layout/Layout.jsx - Main layout wrapper

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="min-h-screen" style={{ background: '#0f172a' }}>
            <Navbar />
            <div className="pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex gap-6">
                        {/* Left sidebar */}
                        <Sidebar />

                        {/* Main content */}
                        <main className="flex-1 min-w-0 animate-fade-in">
                            <Outlet />
                        </main>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}
