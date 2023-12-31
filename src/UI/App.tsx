import Sidebar from './components/single/sidebar';
import BigPanel from './components/single/BigPanel';
import ToastProvider from './components/single/ToastProvider';
import PS_contextProvider from './components/single/PS_context';
import { useState } from 'react';

export default function Home() {
    const [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    function toggleDarkMode() {
        setDarkMode(!darkMode);
    }


    return (
        <div className={`${darkMode ? 'dark' : ''}`}>
            <PS_contextProvider>
                <ToastProvider>
                    <div
                        className={`grid grid-cols-7 grid-rows-1 h-screen text-black dark:text-white dark:bg-gray-300 w-screen dark:[color-scheme:dark]`}
                    >
                        <Sidebar className="col-span-1" />
                        <BigPanel className="col-span-6" />
                    </div>
                </ToastProvider>
            </PS_contextProvider>
        </div>
    );
}
