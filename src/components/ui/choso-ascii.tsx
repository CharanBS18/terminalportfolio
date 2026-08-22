"use client"

// AsciiArt — "CHOSO ASCII", made with the 21st ASCII editor and baked
// to its exact rendered output (looping video + poster). Zero dependencies:
// one <video> that fills its parent. Drop it behind or inside your content:
// <div className="relative h-96"><AsciiArt className="absolute inset-0" /></div>
// Remix the source recipe (styles, animation, palette) in the editor:
// https://21st.dev/community/ascii/editor?from=d6c48883-6f39-48f0-8551-13fbc3be22c7
export function AsciiArt({ className }: { className?: string }) {
  return (
    <video
      className={className}
      src={"https://assets.21st.dev/ascii-recipes/videos/user_3I84qxcN87SzNHveagqm8YBrmnX/3f021bd9-067f-4c20-97bd-b369f6442093.mp4"}
      poster={"https://assets.21st.dev/ascii-recipes/thumbnails/user_3I84qxcN87SzNHveagqm8YBrmnX/55244fc2-db73-456c-8232-0943e401a754.webp"}
      autoPlay
      loop
      muted
      playsInline
      aria-label={"CHOSO ASCII — animated ASCII art"}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  )
}
