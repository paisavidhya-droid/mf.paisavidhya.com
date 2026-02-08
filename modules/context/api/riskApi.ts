import { createApi } from "@reduxjs/toolkit/query/react";

import { customBaseQuery } from "./baseApi";

export const riskApi = createApi({
  reducerPath: "riskApi",
  baseQuery: customBaseQuery,
  tagTypes: ["RiskQuestionnaire", "RiskAssessment", "RiskBucket"],
  endpoints: (builder) => ({
    // Create Risk Questionnaire
    createRiskQuestionnaire: builder.mutation({
      query: (payload) => ({
        url: "/risk/questionnaires",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["RiskQuestionnaire"],
    }),
    updateRiskQuestionnaire: builder.mutation({
      query: ({ id, body }) => ({
        url: `/risk/questionnaires/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RiskQuestionnaire"],
    }),
    updateRiskQuestion: builder.mutation({
      query: ({ questionnaireId, questionId, body }) => ({
        url: `/risk/questionnaires/${questionnaireId}/questions/${questionId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RiskQuestionnaire"],
    }),
    // List Risk Questionnaires
    listRiskQuestionnaires: builder.query({
      query: () => ({
        url: "/risk/questionnaires",
        method: "GET",
      }),
      providesTags: ["RiskQuestionnaire"],
    }),
    // Get Risk Questionnaire (structure)
    getRiskQuestionnaire: builder.query({
      query: (id) => ({
        url: `/risk/questionnaires/${id}`,
        method: "GET",
      }),
      providesTags: ["RiskQuestionnaire"],
    }),
    // Add single risk question
    addRiskQuestion: builder.mutation({
      query: ({ id, body }) => ({
        url: `/risk/questionnaires/${id}/questions`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["RiskQuestionnaire"],
    }),
    // List risk buckets
    getRiskBuckets: builder.query({
      query: () => ({
        url: "/risk/buckets",
        method: "GET",
      }),
      providesTags: ["RiskBucket"],
    }),
    // Start / Resume Assessment
    startAssessment: builder.mutation({
      query: ({ risk_questionnaire_id, investor_id, restart = false, includeInvestorId = true }) => {
        const baseUrl = "/risk/assessments";
        const url = includeInvestorId && investor_id ? `${baseUrl}?investor_id=${investor_id}` : baseUrl;
        return {
          url,
          method: "POST",
          body: { risk_questionnaire_id, restart },
        };
      },
      invalidatesTags: ["RiskAssessment"],
    }),
    // Get Assessment (by questionnaire)
    getAssessmentByQuestionnaire: builder.query({
      query: ({ risk_questionnaire_id, investor_id, includeInvestorId = true }) => {
        const params = new URLSearchParams({ risk_questionnaire_id: String(risk_questionnaire_id) });
        if (includeInvestorId && investor_id) {
          params.append("investor_id", investor_id);
        }
        return {
          url: `/risk/assessments?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["RiskAssessment"],
    }),
    // Get Assessment (by id)
    getAssessmentById: builder.query({
      query: ({ assessment_id, investor_id, includeInvestorId = true }) => ({
        url: `/risk/assessments/${assessment_id}${includeInvestorId && investor_id ? `?investor_id=${investor_id}` : ""}`,
        method: "GET",
      }),
      providesTags: ["RiskAssessment"],
    }),
    // List assessments for an investor (timeline/history)
    listRiskAssessments: builder.query({
      query: ({ investor_id, page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (investor_id) {
          params.append("investor_id", investor_id);
        }

        return {
          url: `/risk/assessments/all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["RiskAssessment"],
    }),
    // Record Answer
    recordAnswer: builder.mutation({
      query: ({ assessment_id, investor_id, risk_question_id, risk_question_option_id, includeInvestorId = true }) => ({
        url: `/risk/assessments/${assessment_id}/answers${includeInvestorId && investor_id ? `?investor_id=${investor_id}` : ""}`,
        method: "POST",
        body: { risk_question_id, risk_question_option_id },
      }),
      invalidatesTags: ["RiskAssessment"],
    }),
    // Complete Assessment
    completeAssessment: builder.mutation({
      query: ({ assessment_id, investor_id, includeInvestorId = true }) => ({
        url: `/risk/assessments/${assessment_id}/complete${includeInvestorId && investor_id ? `?investor_id=${investor_id}` : ""}`,
        method: "POST",
      }),
      invalidatesTags: ["RiskAssessment"],
    }),
  }),
});

export const {
  useCreateRiskQuestionnaireMutation,
  useUpdateRiskQuestionnaireMutation,
  useUpdateRiskQuestionMutation,
  useListRiskQuestionnairesQuery,
  useGetRiskQuestionnaireQuery,
  useAddRiskQuestionMutation,
  useStartAssessmentMutation,
  useGetAssessmentByQuestionnaireQuery,
  useGetAssessmentByIdQuery,
  useListRiskAssessmentsQuery,
  useRecordAnswerMutation,
  useCompleteAssessmentMutation,
  useGetRiskBucketsQuery,
} = riskApi;
