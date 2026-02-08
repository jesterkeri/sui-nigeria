'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface RiveAnimationProps {
    url: string;
    width?: number | string;
    height?: number | string;
    className?: string;
}

export const RiveAnimation = ({ url, width = '100%', height = 400, className = '' }: RiveAnimationProps) => {
    const { RiveComponent } = useRive({
        src: url,
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
        autoplay: true,
    });

    return (
        <div className={`rive-container ${className}`} style={{ width, height }}>
            <RiveComponent />
        </div>
    );
};
