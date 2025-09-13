import React from 'react';
import dynamic from 'next/dynamic';

const HandwritingOverlay = dynamic(() => import('@/components/ui/HandwritingOverlay'), { ssr: false });

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            {children}
            <HandwritingOverlay />
        </>
    );
};

export default MainLayout;