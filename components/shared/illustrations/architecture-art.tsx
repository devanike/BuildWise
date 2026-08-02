"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const DESCRIPTION =
  "A backend architecture diagram: a client application connects to an API layer, which connects to authentication, a database and file storage.";

const EASE = [0.22, 1, 0.36, 1] as const;

type NodeSpec = {
  x: number;
  y: number;
  width: number;
  label: string;
  detail: string;
  accent?: boolean;
};

const WIDE_NODES: NodeSpec[] = [
  { x: 150, y: 16, width: 220, label: "Client Application", detail: "Web and mobile" },
  { x: 140, y: 176, width: 240, label: "API Layer", detail: "REST endpoints", accent: true },
  { x: 10, y: 340, width: 150, label: "Authentication", detail: "Sessions" },
  { x: 185, y: 340, width: 150, label: "Database", detail: "PostgreSQL" },
  { x: 360, y: 340, width: 150, label: "File Storage", detail: "Object store" },
];

const WIDE_CONNECTORS = [
  "M260 80 V176",
  "M260 244 V340",
  "M260 244 V282 Q260 292 250 292 H95 Q85 292 85 302 V340",
  "M260 244 V282 Q260 292 270 292 H425 Q435 292 435 302 V340",
];

const STACKED_NODES: NodeSpec[] = [
  { x: 40, y: 12, width: 240, label: "Client Application", detail: "Web and mobile" },
  { x: 40, y: 116, width: 240, label: "API Layer", detail: "REST endpoints", accent: true },
  { x: 90, y: 236, width: 210, label: "Authentication", detail: "Sessions" },
  { x: 90, y: 320, width: 210, label: "Database", detail: "PostgreSQL" },
  { x: 90, y: 404, width: 210, label: "File Storage", detail: "Object store" },
];

const STACKED_CONNECTORS = [
  "M160 80 V116",
  "M160 184 V202 Q160 212 150 212 H50 Q40 212 40 222 V426 Q40 436 50 436 H90",
  "M40 268 H90",
  "M40 352 H90",
];

export function ArchitectureArt({ className }: { className?: string }) {
  return (
    <div role="img" aria-label={DESCRIPTION} className={className}>
      <Diagram
        className="sm:hidden"
        idPrefix="stacked"
        viewBox="0 0 320 480"
        nodes={STACKED_NODES}
        connectors={STACKED_CONNECTORS}
      />
      <Diagram
        className="hidden sm:block"
        idPrefix="wide"
        viewBox="0 0 520 430"
        nodes={WIDE_NODES}
        connectors={WIDE_CONNECTORS}
      />
    </div>
  );
}

function Diagram({
  className,
  idPrefix,
  viewBox,
  nodes,
  connectors,
}: {
  className?: string;
  idPrefix: string;
  viewBox: string;
  nodes: NodeSpec[];
  connectors: string[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const nodeFill = `${idPrefix}-node`;
  const coreFill = `${idPrefix}-core`;

  return (
    <motion.svg
      viewBox={viewBox}
      aria-hidden="true"
      fill="none"
      className={cn("h-auto w-full", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <defs>
        <linearGradient id={nodeFill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--illo-from)" />
          <stop offset="100%" stopColor="var(--illo-to)" />
        </linearGradient>
        <linearGradient id={coreFill} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--illo-from)" />
          <stop offset="100%" stopColor="var(--illo-core-to)" />
        </linearGradient>
      </defs>

      {connectors.map((d, index) => (
        <motion.path
          key={d}
          d={d}
          stroke="var(--illo-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.7, delay: 0.15 + index * 0.08, ease: EASE },
            },
          }}
        />
      ))}

      {!prefersReducedMotion
        ? connectors.map((d, index) => (
            <motion.circle
              key={`pulse-${d}`}
              r="3.5"
              fill="var(--accent-base)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                repeatDelay: 1.8,
                delay: index * 0.6,
                times: [0, 0.15, 0.85, 1],
                ease: "linear",
              }}
            >
              <animateMotion
                dur="2.4s"
                repeatCount="indefinite"
                begin={`${index * 0.6}s`}
                path={d}
                calcMode="linear"
              />
            </motion.circle>
          ))
        : null}

      {nodes.map((node, index) => (
        <motion.g
          key={node.label}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: index * 0.09, ease: EASE },
            },
          }}
        >
          <motion.rect
            x={node.x}
            y={node.y}
            width={node.width}
            height={68}
            rx={16}
            fill={node.accent ? `url(#${coreFill})` : `url(#${nodeFill})`}
            stroke={node.accent ? "var(--accent-base)" : "var(--illo-line)"}
            strokeWidth="1.5"
            animate={
              node.accent && !prefersReducedMotion
                ? { strokeOpacity: [1, 0.5, 1] }
                : undefined
            }
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <text
            x={node.x + node.width / 2}
            y={node.y + 30}
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="var(--text)"
          >
            {node.label}
          </text>
          <text
            x={node.x + node.width / 2}
            y={node.y + 49}
            textAnchor="middle"
            fontSize="12"
            fill={node.accent ? "var(--accent-text)" : "var(--text-subtle)"}
          >
            {node.detail}
          </text>
        </motion.g>
      ))}
    </motion.svg>
  );
}
