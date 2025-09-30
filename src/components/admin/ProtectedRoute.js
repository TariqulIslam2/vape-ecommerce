// /app/components/ProtectedRoute.js
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from './preloader/Loading';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated' && !redirecting) {
            setRedirecting(true);
            router.push('/login');
        } else if (status === 'authenticated' && allowedRoles && !allowedRoles.includes(session?.user?.role)) {
            setRedirecting(true);
            // Redirect based on role
            if (session?.user?.role === 3) {
                router.push('/userdashboard');
            } else if (session?.user?.role === 1 || session?.user?.role === 2) {
                router.push('/dashboard');
            } else {
                router.push('/');
            }
        }
    }, [session, status, redirecting, allowedRoles, router]);

    if (status === 'loading' || redirecting) {
        return <Loading />;
    }

    if (status === 'authenticated' && (!allowedRoles || allowedRoles.includes(session?.user?.role))) {
        return <>{children}</>;
    }

    // Show nothing while redirecting
    return null;
};

export default ProtectedRoute;