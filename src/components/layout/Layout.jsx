import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import VoiceAssistant from '../VoiceAssistant';
import PWAInstallButton from '../PWAInstallButton';

export default function Layout() {
    return (
        <div className="flex h-screen bg-background text-text overflow-hidden">
            <div className="hidden md:flex">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 relative z-0">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px]" />
                    </div>

                    <Outlet />
                </main>
                <BottomNav />
                <VoiceAssistant />
                <PWAInstallButton />
            </div>
        </div>
    );
}
