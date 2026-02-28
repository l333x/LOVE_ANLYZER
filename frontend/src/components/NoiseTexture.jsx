/**
 * SVG feTurbulence noise overlay — gives a tactile, grainy look.
 * Fixed, full-screen, pointer-events-none.
 */
export default function NoiseTexture() {
    return (
        <svg
            className="fixed inset-0 w-full h-full pointer-events-none z-[999]"
            style={{ opacity: 0.035 }}
        >
            <filter id="noise">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.65"
                    numOctaves="4"
                    stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
    );
}
