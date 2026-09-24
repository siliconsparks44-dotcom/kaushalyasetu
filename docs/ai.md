# AI Service Architecture & Governance

## Pluggable Provider Interface
```typescript
export interface AIProvider {
  name: string;
  extractSkills(text: string): Promise<ExtractedSkill[]>;
  analyzeJob(text: string): Promise<JobAnalysisResult>;
  analyzeResume(text: string): Promise<ResumeAnalysisResult>;
  generateCurriculumRecommendations(
    courseTitle: string,
    courseSkills: string[],
    industryDemandSkills: { name: string; count: number; growthPct?: number }[]
  ): Promise<RecommendationItem[]>;
}
```

## Fallback & Offline Resilience
The platform implements `LocalRuleNLPProvider`, which performs deterministic tokenization, regex taxonomy pattern matching, and synonym resolution against normalized database skills. If no external API key (`AI_API_KEY`) is set, the system automatically uses this provider with zero performance degradation and zero cost.

## Mathematical Course Alignment Calculation
$$\text{Alignment Score} = \left( \frac{\text{Count of Covered Top Demanded Skills}}{\text{Total Evaluated Top Demanded Skills}} \right) \times 100\%$$

## Human-in-the-Loop Governance
Under no circumstances does the AI modify official course curricula, reduce student capacity, or delete modules autonomously. AI outputs are presented as `PENDING` recommendations with evidence and confidence metrics, requiring administrative or institute faculty approval.
