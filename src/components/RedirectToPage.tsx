import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

interface RedirectToPageProps {
    to: string;
}

const RedirectToPage: React.FC<RedirectToPageProps> = ({ to }) => {
    const router = useRouter();

    useEffect(() => {
        router.push(to);
    }, [to, router]);

    return null; // This component doesn't render anything
};

export default RedirectToPage; 