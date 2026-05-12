"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";

interface Position { left: number; width: number; opacity: number }

interface NavItem { label: string; to: string }

const ITEMS: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Generator", to: "/generator" },
  { label: "About", to: "/about" },
];

export default function NavHeader() {
  const [position, setPosition] = useState<Position>({ left: 0, width: 0, opacity: 0 });
  const location = useLocation();

  return (
    <ul
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
      className="relative mx-auto flex w-fit rounded-full border border-border bg-surface/80 p-1 backdrop-blur-md"
    >
      {ITEMS.map((item) => (
        <Tab key={item.to} setPosition={setPosition} to={item.to} active={location.pathname === item.to}>
          {item.label}
        </Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
}

function Tab({
  children, setPosition, to, active,
}: { children: React.ReactNode; setPosition: (p: Position) => void; to: string; active: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ width, opacity: 1, left: ref.current.offsetLeft });
      }}
      className="relative z-10 block list-none"
    >
      <Link
        to={to}
        className={`block cursor-pointer px-3 py-1.5 text-xs uppercase tracking-wider mix-blend-difference md:px-5 md:py-3 md:text-sm ${
          active ? "text-white font-semibold" : "text-white/90"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}

function Cursor({ position }: { position: Position }) {
  return (
    <motion.li
      animate={{ ...position }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute z-0 h-7 rounded-full bg-foreground md:h-12"
    />
  );
}
