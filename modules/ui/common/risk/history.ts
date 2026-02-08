export type RiskQuestionOptionLite = {
  id?: number;
  option_label?: string;
  option_text?: string;
  option_order?: number;
  points?: number;
};

export type InvestorRiskAnswerLite = {
  id?: number;
  risk_question_id: number;
  risk_question_option?: RiskQuestionOptionLite;
};

export type SnapshotResponseItem = {
  question_id: number;
  question_text: string;
  question_order: number;
  selected_option?: {
    id?: number;
    label?: string;
    text?: string;
    points?: number;
    option_order?: number;
  };
};

export type SnapshotPayload = {
  responses: SnapshotResponseItem[];
  total_score: number | null;
  submitted_at?: string;
  questionnaire?: {
    id?: number;
    name?: string;
    version?: number;
  };
};

export type BucketAssetAllocationItem = {
  id?: number;
  asset_class?: string;
  target_percentage?: string;
};

export type BucketSubAllocationItem = {
  id?: number;
  asset_class?: string;
  sub_asset?: string;
  target_percentage?: string;
};

export type RiskBucketLite = {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  min_score?: number;
  max_score?: number;
  version?: number;
  bucket_asset_allocation?: BucketAssetAllocationItem[];
  bucket_sub_allocation?: BucketSubAllocationItem[];
};

export type RiskBucketAssignment = {
  id?: number;
  investor_id?: string;
  investor_risk_assessment_id?: number;
  risk_bucket_id?: number;
  total_score?: number;
  bucket_version?: number;
  assigned_at?: string;
  assigned_by?: string;
  is_active?: boolean;
  risk_bucket?: RiskBucketLite;
};

export type RiskAssessmentHistoryRow = {
  id: number;
  investor_id?: string;
  risk_questionnaire_id?: number;
  total_score: number | null;
  performed_by?: string;
  completed?: boolean;
  started_at?: string | null;
  completed_at?: string | null;
  updated_at?: string | null;
  final_snapshot?: SnapshotPayload | null;
  snapshot_version?: number | null;
  risk_questionnaire?: {
    id?: number;
    name?: string;
    version?: number;
    description?: string | null;
  };
  investor_risk_answer?: InvestorRiskAnswerLite[];
  investor_risk_bucket_assignment?: RiskBucketAssignment[];
};

export type RiskAssessmentHistoryResponse = {
  data?: {
    list: RiskAssessmentHistoryRow[];
    total: number;
    page: number;
    limit: number;
  };
};

export const formatRiskAssessmentDateTime = (value?: string | null) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString();
};

export const buildSnapshotFromHistoryRow = (row: RiskAssessmentHistoryRow): SnapshotPayload => {
  if (row.final_snapshot) {
    return row.final_snapshot;
  }

  const fallbackResponses: SnapshotResponseItem[] = (row.investor_risk_answer ?? []).map((answer, index) => ({
    question_id: answer.risk_question_id,
    question_text: `Question ${answer.risk_question_id}`,
    question_order: index + 1,
    selected_option: answer.risk_question_option
      ? {
          id: answer.risk_question_option.id,
          label: answer.risk_question_option.option_label,
          text: answer.risk_question_option.option_text,
          points: answer.risk_question_option.points,
          option_order: answer.risk_question_option.option_order,
        }
      : undefined,
  }));

  return {
    responses: fallbackResponses,
    total_score: row.total_score ?? null,
    submitted_at: row.completed_at ?? row.updated_at ?? undefined,
    questionnaire: row.risk_questionnaire,
  };
};

export const sortSnapshotResponses = (responses: SnapshotResponseItem[]) =>
  [...responses].sort((a, b) => a.question_order - b.question_order);
