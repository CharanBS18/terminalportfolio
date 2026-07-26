"use client"

// AsciiArt — "Sa7bi", made with the 21st.dev ASCII editor and baked
// to its exact rendered output (looping video + poster). Zero dependencies:
// one <video> that fills its parent. Drop it behind or inside your content:
// <div className="relative h-96"><AsciiArt className="absolute inset-0" /></div>
// Remix the source recipe (styles, animation, palette) in the editor:
// https://21st.dev/community/ascii/editor?from=2a4878ca-13d3-4621-af92-6310621cbd40
export function AsciiArt({ className }: { className?: string }) {
  return (
    <video
      className={className}
      src={"https://assets.21st.dev/ascii-recipes/videos/user_36rrwGaolCyrqj84KQ6lr4wc0Ns/9979b206-8c1b-4589-9a0b-55e358373203.mp4"}
      poster={"https://assets.21st.dev/ascii-recipes/thumbnails/user_36rrwGaolCyrqj84KQ6lr4wc0Ns/ec15488f-0ffd-4626-8668-84adf79cb841.webp"}
      autoPlay
      loop
      muted
      playsInline
      aria-label={"Sa7bi — animated ASCII art"}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  )
}
