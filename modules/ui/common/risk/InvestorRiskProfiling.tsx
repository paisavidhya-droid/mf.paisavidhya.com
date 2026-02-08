import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import {
  ThemeContext,
  useCompleteAssessmentMutation,
  useGetAssessmentByQuestionnaireQuery,
  useGetRiskQuestionnaireQuery,
  useListRiskQuestionnairesQuery,
  useRecordAnswerMutation,
  useStartAssessmentMutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { toastHelper } from "@niveshstar/utils";

import Button from "../../Button";
import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import RiskAssessmentHistory from "./RiskAssessmentHistory";

type InvestorRiskProfilingProps = {
  investorId?: string | null;
  includeInvestorParam?: boolean;
};

type QuestionnaireSummary = {
  id: number;
  name: string;
  version: number;
  description?: string | null;
  is_active?: boolean;
};

type RiskQuestionOptionType = {
  id: number;
  option_label: string;
  option_text: string;
  option_order: number;
  points: number;
};

type RiskQuestionType = {
  id: number;
  question_text: string;
  question_order: number;
  risk_question_option?: RiskQuestionOptionType[];
};

type RiskAssessmentAnswerType = {
  id: number;
  risk_question_id: number;
  risk_question_option_id: number;
  risk_question_option?: RiskQuestionOptionType;
};

type RiskAssessmentType = {
  id: number;
  total_score?: number | null;
  completed?: boolean;
  started_at?: string | null;
  completed_at?: string | null;
  investor_risk_answer?: RiskAssessmentAnswerType[];
};

function InvestorRiskProfiling({
  investorId: investorIdProp,
  includeInvestorParam = true,
}: InvestorRiskProfilingProps = {}) {
  const { params } = useNavigation();
  const investorIdFromParams = params?.investorId as string | undefined;
  const investorId = investorIdProp ?? investorIdFromParams;

  const { themeColor } = useContext(ThemeContext);

  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, RiskQuestionOptionType>>({});

  const {
    data: questionnaireListResponse,
    isLoading: isQuestionnaireListLoading,
    isFetching: isQuestionnaireListFetching,
  } = useListRiskQuestionnairesQuery({});

  const questionnaireCollection = useMemo<QuestionnaireSummary[]>(
    () => (questionnaireListResponse?.data ?? []) as QuestionnaireSummary[],
    [questionnaireListResponse]
  );

  const {
    data: questionnaireDetails,
    isFetching: isQuestionnaireFetching,
    isLoading: isQuestionnaireLoading,
  } = useGetRiskQuestionnaireQuery(selectedQuestionnaireId!, {
    skip: !selectedQuestionnaireId,
  });

  const {
    data: assessmentResponse,
    isFetching: isAssessmentFetching,
    isLoading: isAssessmentLoading,
  } = useGetAssessmentByQuestionnaireQuery(
    {
      risk_questionnaire_id: Number(selectedQuestionnaireId),
      investor_id: investorId as string,
      includeInvestorId: includeInvestorParam,
    },
    {
      skip: !selectedQuestionnaireId || !investorId,
    }
  );

  const existingAssessment = useMemo<RiskAssessmentType | undefined>(() => {
    const data = assessmentResponse?.data;
    if (!data) return undefined;
    if (Array.isArray(data)) {
      return (data[0] ?? undefined) as RiskAssessmentType | undefined;
    }
    return data as RiskAssessmentType;
  }, [assessmentResponse]);

  const riskQuestions = useMemo<RiskQuestionType[]>(
    () => (questionnaireDetails?.data?.risk_question ?? []) as RiskQuestionType[],
    [questionnaireDetails]
  );

  const totalQuestions = riskQuestions.length;
  const currentQuestion = totalQuestions > 0 && !isCompleted ? riskQuestions[currentQuestionIndex] : undefined;

  const [startAssessment, { isLoading: isStartingAssessment }] = useStartAssessmentMutation();

  const isSelectedQuestionnaireActive = questionnaireDetails?.data?.is_active !== false;
  const [recordAnswer, { isLoading: isRecordingAnswer }] = useRecordAnswerMutation();
  const [completeAssessment, { isLoading: isCompletingAssessment }] = useCompleteAssessmentMutation();

  const getErrorMessage = useCallback((error: any) => {
    if (error?.data?.message) return error.data.message as string;
    if (error?.message) return error.message as string;
    return "Something went wrong";
  }, []);

  const resetAssessmentState = useCallback(() => {
    setAssessmentId(null);
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setAnswers({});
  }, []);

  const handleSelectQuestionnaire = useCallback(
    (id: number) => {
      setSelectedQuestionnaireId(String(id));
      resetAssessmentState();
    },
    [resetAssessmentState]
  );

  const handleStartAssessment = useCallback(
    async (shouldRestart = false) => {
      if (!investorId) {
        toastHelper("error", "Missing investor information");
        return;
      }

      if (!selectedQuestionnaireId) {
        toastHelper("error", "Please pick a questionnaire");
        return;
      }

      if (!isSelectedQuestionnaireActive) {
        toastHelper("error", "This questionnaire is inactive and cannot be started.");
        return;
      }

      if (!shouldRestart && existingAssessment?.id) {
        setAssessmentId(existingAssessment.id);
        setIsCompleted(Boolean(existingAssessment.completed));
        return;
      }

      try {
        const response = await startAssessment({
          risk_questionnaire_id: Number(selectedQuestionnaireId),
          investor_id: investorId,
          restart: shouldRestart,
          includeInvestorId: includeInvestorParam,
        }).unwrap();

        const createdAssessmentId =
          response?.data?.id ?? response?.data?.assessment_id ?? response?.data?.assessment?.id ?? response?.id ?? null;

        if (createdAssessmentId) {
          setAssessmentId(createdAssessmentId);
          setCurrentQuestionIndex(0);
          setIsCompleted(false);
          setAnswers({});
          toastHelper("success", shouldRestart ? "Assessment restarted" : "Assessment started");
        } else {
          toastHelper("error", "Unable to determine assessment id");
        }
      } catch (error: any) {
        const requiresRestart =
          !shouldRestart && typeof error?.data?.message === "string"
            ? error.data.message.toLowerCase().includes("restart=true")
            : false;

        if (requiresRestart) {
          toastHelper("success", "Assessment completed earlier. Restarting now...");
          await handleStartAssessment(true);
          return;
        }

        toastHelper("error", getErrorMessage(error));
      }
    },
    [
      existingAssessment,
      getErrorMessage,
      includeInvestorParam,
      investorId,
      selectedQuestionnaireId,
      startAssessment,
      isSelectedQuestionnaireActive,
    ]
  );

  const handleAnswer = useCallback(
    async (option: RiskQuestionOptionType) => {
      if (!investorId || !assessmentId || !currentQuestion) {
        return;
      }

      if (!isSelectedQuestionnaireActive) {
        toastHelper("error", "This questionnaire is inactive and cannot be answered.");
        return;
      }

      try {
        await recordAnswer({
          assessment_id: assessmentId,
          investor_id: investorId,
          risk_question_id: currentQuestion.id,
          risk_question_option_id: option.id,
          includeInvestorId: includeInvestorParam,
        }).unwrap();

        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));

        if (currentQuestionIndex + 1 < totalQuestions) {
          setCurrentQuestionIndex((prev) => prev + 1);
          toastHelper("success", "Answer recorded");
        } else {
          await completeAssessment({
            assessment_id: assessmentId,
            investor_id: investorId,
            includeInvestorId: includeInvestorParam,
          }).unwrap();
          setIsCompleted(true);
          toastHelper("success", "Assessment completed");
        }
      } catch (error: any) {
        toastHelper("error", getErrorMessage(error));
      }
    },
    [
      assessmentId,
      completeAssessment,
      currentQuestion,
      currentQuestionIndex,
      getErrorMessage,
      includeInvestorParam,
      investorId,
      recordAnswer,
      totalQuestions,
      isSelectedQuestionnaireActive,
    ]
  );

  const isQuestionnaireListBusy = isQuestionnaireListLoading || isQuestionnaireListFetching;
  const isQuestionnaireDetailsBusy = isQuestionnaireFetching || isQuestionnaireLoading;
  const isAssessmentBusy = isAssessmentFetching || isAssessmentLoading;
  const isAnswering = isRecordingAnswer || isCompletingAssessment;

  // Risk assessment history is now handled by a component; no custom hook usage.

  useEffect(() => {
    if (!existingAssessment || !existingAssessment.id) {
      return;
    }

    const derivedAnswers = (existingAssessment.investor_risk_answer ?? []).reduce(
      (acc: Record<number, RiskQuestionOptionType>, item: RiskAssessmentAnswerType) => {
        if (item?.risk_question_id && item?.risk_question_option) {
          acc[item.risk_question_id] = item.risk_question_option;
        }
        return acc;
      },
      {}
    );

    setAssessmentId((prev) => (prev === existingAssessment.id ? prev : existingAssessment.id));
    setAnswers(derivedAnswers);

    const completed = Boolean(existingAssessment.completed);
    setIsCompleted(completed);

    if (riskQuestions.length === 0) {
      return;
    }

    if (completed) {
      setCurrentQuestionIndex(0);
      return;
    }

    const nextIndex = riskQuestions.findIndex((question) => !derivedAnswers[question.id]);
    setCurrentQuestionIndex(nextIndex === -1 ? Math.max(riskQuestions.length - 1, 0) : nextIndex);
  }, [existingAssessment, riskQuestions]);

  return (
    <CustomCard>
      <Typography size="5" weight="medium">
        Investor Risk Profiling
      </Typography>

      <Padding height={16} />
      <Typography size="3" weight="medium">
        Select Questionnaire
      </Typography>
      <Padding height={8} />

      {isQuestionnaireListBusy ? (
        <ActivityIndicator color={themeColor.accent[9]} />
      ) : questionnaireCollection.length === 0 ? (
        <Typography size="2" color={themeColor.gray[8]}>
          No questionnaires available.
        </Typography>
      ) : (
        <FlexRow colGap={8} rowGap={8} wrap>
          {questionnaireCollection.map((item) => {
            const isActive = item.is_active !== false;
            const variant = selectedQuestionnaireId === String(item.id) ? "soft" : isActive ? "outline" : "ghost";
            return (
              <View key={item.id} style={{ alignItems: "center", marginBottom: 8 }}>
                <Button
                  title={item.name}
                  variant={variant}
                  onPress={() => handleSelectQuestionnaire(item.id)}
                  style={{ alignSelf: "flex-start", opacity: isActive ? 1 : 0.5 }}
                />
                {!isActive ? (
                  <Typography size="1" color={themeColor.red[9]}>
                    Inactive
                  </Typography>
                ) : null}
              </View>
            );
          })}
        </FlexRow>
      )}

      <Padding height={12} />
      <FlexRow colGap={8} rowGap={8} wrap>
        <Button
          title={assessmentId ? (isCompleted ? "View Assessment" : "Resume Assessment") : "Start Assessment"}
          onPress={() => handleStartAssessment(false)}
          disabled={!selectedQuestionnaireId || isStartingAssessment || !isSelectedQuestionnaireActive}
          loading={isStartingAssessment && !assessmentId}
        />
        {assessmentId ? (
          <Button
            title="Restart"
            variant="outline"
            onPress={() => handleStartAssessment(true)}
            disabled={isStartingAssessment || !isSelectedQuestionnaireActive}
          />
        ) : null}
      </FlexRow>

      {!isSelectedQuestionnaireActive ? <Padding height={8} /> : null}

      {!isSelectedQuestionnaireActive ? (
        <Typography size="2" color={themeColor.red[9]}>
          This questionnaire is currently inactive. You cannot start or answer this questionnaire.
        </Typography>
      ) : null}

      {selectedQuestionnaireId ? (
        <View>
          <Padding height={20} />
          <Typography size="3" weight="medium">
            Assessment Progress
          </Typography>
          <Padding height={4} />

          {isQuestionnaireDetailsBusy || isAssessmentBusy ? (
            <ActivityIndicator color={themeColor.accent[9]} />
          ) : totalQuestions === 0 ? (
            <Typography size="2" color={themeColor.gray[8]}>
              No questions found for this questionnaire.
            </Typography>
          ) : (
            <View>
              {existingAssessment && assessmentId ? (
                <View>
                  <Typography size="2" weight="medium">
                    Latest Assessment
                  </Typography>
                  <Padding height={4} />
                  <Typography size="2">Status: {existingAssessment.completed ? "Completed" : "In Progress"}</Typography>
                  {existingAssessment.total_score != null ? (
                    <Typography size="2">Total Score: {existingAssessment.total_score}</Typography>
                  ) : null}
                  {existingAssessment.started_at ? (
                    <Typography size="2">
                      Started: {new Date(existingAssessment.started_at).toLocaleString()}
                    </Typography>
                  ) : null}
                  {existingAssessment.completed_at ? (
                    <Typography size="2">
                      Completed: {new Date(existingAssessment.completed_at).toLocaleString()}
                    </Typography>
                  ) : null}
                  <Padding height={12} />
                </View>
              ) : null}

              {isCompleted ? (
                <View>
                  <Typography size="2" weight="medium">
                    Assessment complete. Summary:
                  </Typography>
                  <Padding height={8} />
                  {riskQuestions.map((question) => {
                    const selectedOption = answers[question.id];
                    return (
                      <View key={question.id} style={{ marginBottom: 12 }}>
                        <Typography weight="medium">
                          {question.question_order}. {question.question_text}
                        </Typography>
                        <Padding height={4} />
                        {selectedOption ? (
                          <Typography size="2" color={themeColor.green[11]}>
                            Selected: {selectedOption.option_label}. {selectedOption.option_text} (
                            {selectedOption.points} pts)
                          </Typography>
                        ) : (
                          <Typography size="2" color={themeColor.gray[8]}>
                            No response recorded.
                          </Typography>
                        )}
                      </View>
                    );
                  })}
                </View>
              ) : currentQuestion ? (
                <View>
                  <Typography weight="medium">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </Typography>
                  <Padding height={8} />
                  <Typography size="3" weight="medium">
                    {currentQuestion.question_text}
                  </Typography>
                  <Padding height={12} />
                  {currentQuestion.risk_question_option?.map((option) => (
                    <View key={option.id} style={{ marginBottom: 8 }}>
                      <Button
                        title={`${option.option_label}. ${option.option_text}`}
                        onPress={() => handleAnswer(option)}
                        disabled={isAnswering || !isSelectedQuestionnaireActive}
                        loading={isAnswering}
                        style={{ alignSelf: "flex-start" }}
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <Typography size="2" color={themeColor.gray[8]}>
                  Click start to begin the assessment.
                </Typography>
              )}
            </View>
          )}
        </View>
      ) : null}

      <Padding height={24} />

      <RiskAssessmentHistory
        investorId={investorId as string | undefined}
        includeInvestorParam={includeInvestorParam}
      />
    </CustomCard>
  );
}

export default React.memo(InvestorRiskProfiling);
