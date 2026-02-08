'use client';

import Spline from '@splinetool/react-spline';

interface SplineAnimationProps {
    url: string;
    className?: string;
}

export const SplineAnimation = ({ url, className = '' }: SplineAnimationProps) => {
    return (
        <div className={`w-full h-[400px] ${className}`}>
            <Spline scene={url} />
        </div>
    );
};
