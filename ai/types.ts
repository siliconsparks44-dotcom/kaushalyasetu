export interface ExtractedSkill {
  name: string;
  normalizedName?: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  importance: 'required' | 'preferred' | 'optional';
  confidence: number;
  category?: string;
}

export interface JobAnalysisResult {
  role: string;
  sector?: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  skills: ExtractedSkill[];
  technologies: string[];
  tools: string[];
  summary: string;
}

export interface ResumeAnalysisResult {
  candidateName?: string;
  educationLevel?: string;
  yearsOfExperience?: number;
  skills: ExtractedSkill[];
  technologies: string[];
  certifications: string[];
  projects: string[];
  summary: string;
}

export interface RecommendationItem {
  actionType: 'ADD' | 'UPDATE' | 'INCREASE_PRACTICAL' | 'CONSIDER' | 'REVIEW';
  skillName: string;
  affectedModule?: string;
  reason: string;
  supportingData: {
    marketDemandCount?: number;
    growthPercent?: number;
    coverageStatus?: string;
  };
  confidence: number;
}

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
