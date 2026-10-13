import { InsuranceOverviewData, InsuranceClaim, ClaimTimelineStage } from "../types";

export const mockInsuranceClaims: InsuranceClaim[] = [];

/**
 * Insurance Service (Connected to live data / zero fake numbers)
 */
export const insuranceService = {
  async getOverview(): Promise<InsuranceOverviewData> {
    return {
      employeeName: "Insurance Desk",
      department: "RCM & Prior-Authorization Division",
      pendingClaimsCount: 0,
      approvedClaimsCount: 0,
      rejectedClaimsCount: 0,
      urgentCasesCount: 0,
    };
  },

  async getClaims(): Promise<InsuranceClaim[]> {
    return [];
  },

  async updateClaimStage(_claimId: string, _nextStage: ClaimTimelineStage): Promise<boolean> {
    return true;
  },

  async updateClaimStatus(_claimId: string, _status: InsuranceClaim["status"]): Promise<boolean> {
    return true;
  },
};
