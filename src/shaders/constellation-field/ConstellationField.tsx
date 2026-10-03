"use client";

import {
  ConnectivityGraph,
  ConstellationField as ConstellationFieldEffect,
  DefenseLines,
  GatewayFlow,
  InterfaceLines,
  ParticleDrift,
  ParticleNetwork,
  TopoField,
  type NeuformBatchEffectProps,
} from "../neuform-isolated/NeuformBatchEffects";

const variants = {
  "constellation-field": ConstellationFieldEffect,
  "particle-drift": ParticleDrift,
  "particle-network": ParticleNetwork,
  "gateway-flow": GatewayFlow,
  "connectivity-graph": ConnectivityGraph,
  "interface-lines": InterfaceLines,
  "defense-lines": DefenseLines,
  "topo-field": TopoField,
} as const;

export type ConstellationFieldVariant = keyof typeof variants;

export type ConstellationFieldProps = NeuformBatchEffectProps & {
  variant?: ConstellationFieldVariant;
};

export function ConstellationField({ variant = "constellation-field", ...props }: ConstellationFieldProps) {
  const Effect = variants[variant];
  return <Effect {...props} />;
}
