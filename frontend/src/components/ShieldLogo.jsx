function ShieldLogo({ size = 70 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>

                <linearGradient
                    id="mainGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stopColor="#52E5FF" />
                    <stop offset="40%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>

                <linearGradient
                    id="shineGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                >
                    <stop offset="0%" stopColor="white" stopOpacity=".7" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>

                <filter id="outerGlow">
                    <feGaussianBlur stdDeviation="18" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

            </defs>

            {/* Glow */}

            <path
                d="
        M256 38
        L396 96
        V220
        C396 336 330 420 256 470
        C182 420 116 336 116 220
        V96
        Z
        "
                fill="url(#mainGradient)"
                opacity=".22"
                filter="url(#outerGlow)"
            />

            {/* Main Shield */}

            <path
                d="
        M256 52
        L382 104
        V218
        C382 322 324 396 256 438
        C188 396 130 322 130 218
        V104
        Z
        "
                fill="url(#mainGradient)"
            />

            {/* Glass Layer */}

            <path
                d="
        M256 72
        L360 118
        V206
        C360 288 312 348 256 382
        C200 348 152 288 152 206
        V118
        Z
        "
                fill="url(#shineGradient)"
                opacity=".25"
            />

            {/* Border */}

            <path
                d="
        M256 52
        L382 104
        V218
        C382 322 324 396 256 438
        C188 396 130 322 130 218
        V104
        Z
        "
                fill="none"
                stroke="rgba(255,255,255,.25)"
                strokeWidth="5"
            />
            {/* Futuristic S */}

            <path
                d="
          M318 165
          C296 140 228 140 205 170
          C186 194 198 220 248 232
          C306 246 318 257 318 281
          C318 309 293 330 252 330
          C223 330 197 319 178 296
        "
                fill="none"
                stroke="white"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Cyan Highlight */}

            <path
                d="
          M312 168
          C292 147 233 147 213 172
        "
                fill="none"
                stroke="#A5F3FC"
                strokeWidth="8"
                opacity=".45"
                strokeLinecap="round"
            />

            {/* Premium Check */}

            <path
                d="
          M185 258
          L228 301
          L332 198
        "
                fill="none"
                stroke="white"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#outerGlow)"
            />

            {/* Check Gradient */}

            <path
                d="
          M188 258
          L228 298
          L326 202
        "
                fill="none"
                stroke="#7DD3FC"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity=".8"
            />

            {/* Top Shine */}

            <ellipse
                cx="256"
                cy="105"
                rx="95"
                ry="20"
                fill="white"
                opacity=".12"
            />

            {/* Bottom Reflection */}

            <ellipse
                cx="256"
                cy="392"
                rx="70"
                ry="16"
                fill="white"
                opacity=".05"
            />

            {/* Center Glow */}

            <circle
                cx="256"
                cy="245"
                r="78"
                fill="#38BDF8"
                opacity=".08"
            />

        </svg>
    );
}

export default ShieldLogo;