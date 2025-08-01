import { ImpactAnalysis, RequestPriority } from "@shared/types";

export function calculatePriority(
  impactAnalysis: ImpactAnalysis,
): RequestPriority {
  const {
    isRegulatoryRequirement,
    financialImpactUSD,
    customerImpact,
    operationalUrgency,
  } = impactAnalysis;

  // High Priority Rules:
  // 1 = Yes, 2 ≥ 100,000, 3 = Both, 4 = Yes
  if (
    isRegulatoryRequirement &&
    financialImpactUSD >= 100000 &&
    customerImpact === "both" &&
    operationalUrgency
  ) {
    return "high";
  }

  // Medium Priority Rules:
  // 1 = Yes, 50,000 ≤ 2 < 100,000, 3 = Both, 4 = Yes
  if (
    isRegulatoryRequirement &&
    financialImpactUSD >= 50000 &&
    financialImpactUSD < 100000 &&
    customerImpact === "both" &&
    operationalUrgency
  ) {
    return "medium";
  }

  // All other combinations = Low
  return "low";
}

export function getPriorityExplanation(impactAnalysis: ImpactAnalysis): string {
  const {
    isRegulatoryRequirement,
    financialImpactUSD,
    customerImpact,
    operationalUrgency,
  } = impactAnalysis;

  const priority = calculatePriority(impactAnalysis);

  if (priority === "high") {
    return "High priority: Meets all criteria (Regulatory requirement, Financial impact ≥$100k, Both customer impact, Operational urgency)";
  } else if (priority === "medium") {
    return "Medium priority: Regulatory requirement with financial impact $50k-$100k, both customer impact, and operational urgency";
  } else {
    const missing = [];
    if (!isRegulatoryRequirement) missing.push("regulatory requirement");
    if (financialImpactUSD < 50000)
      missing.push("minimum financial impact ($50k)");
    if (customerImpact !== "both")
      missing.push("both internal and external customer impact");
    if (!operationalUrgency) missing.push("operational urgency");

    return `Low priority: Does not meet high/medium criteria. Missing: ${missing.join(", ")}`;
  }
}
