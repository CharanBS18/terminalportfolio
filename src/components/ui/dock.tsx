"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

interface DockProps {
  children: React.ReactNode;
  className?: string;
}

export function Dock({ children, className = "" }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`mx-auto flex h-16 items-end gap-3 rounded-2xl bg-zinc-900/30 border border-white/15 backdrop-blur-xl px-4 pb-3 shadow-xl pointer-events-auto ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ mouseX: typeof mouseX }>, { mouseX });
        }
        return child;
      })}
    </motion.div>
  );
}

interface DockIconProps {
  children?: React.ReactNode;
  mouseX?: MotionValue<number>;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  title?: string;
  src?: string;
  href?: string;
  name?: string;
}

export function DockIcon({ children, mouseX, className = "", onClick, title, src, href, name }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fallbackMouseX = useMotionValue(Infinity);

  const distance = useTransform(mouseX || fallbackMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(distance, [-150, 0, 150], [46, 68, 46]);

  const size = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 180,
    damping: 13,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onClick={onClick}
      className={`flex aspect-square cursor-pointer items-center justify-center rounded-xl bg-black/40 border border-white/10 hover:border-white/30 hover:bg-black/60 transition-colors select-none relative ${className}`}
      title={title ?? name}
    >
      {src ? (
        href ? (
          <a href={href} target="_blank" rel="noreferrer noopener" className="w-full h-full flex items-center justify-center">
            <img src={src} alt={name ?? title ?? "dock icon"} className="w-[62%] h-[62%] object-contain rounded-md" />
          </a>
        ) : (
          <img src={src} alt={name ?? title ?? "dock icon"} className="w-[62%] h-[62%] object-contain rounded-md" />
        )
      ) : (
        children
      )}
    </motion.div>
  );
}
