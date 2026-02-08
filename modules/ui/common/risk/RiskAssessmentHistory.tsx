import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";

import { ThemeContext, useListRiskAssessmentsQuery } from "@niveshstar/context";

import Button from "../../Button";
import CustomCard from "../../CustomCard";
import EmptyResult from "../../EmptyResult";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import BucketAllocations from "./BucketAllocations";
import {
  buildSnapshotFromHistoryRow,
  formatRiskAssessmentDateTime,
  RiskAssessmentHistoryResponse,
  RiskAssessmentHistoryRow,
  SnapshotPayload,
  SnapshotResponseItem,
  sortSnapshotResponses,
} from "./history";

interface PropsType {
  investorId?: string;
  includeInvestorParam?: boolean;
}

function RiskAssessmentHistory(props: PropsType) {
  const { investorId, includeInvestorParam = true } = props;
  const { themeColor } = useContext(ThemeContext);

  const [page, setPage] = useState(1);
  const [timeline, setTimeline] = useState<RiskAssessmentHistoryRow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const queryArgs = useMemo(() => {
    const params: { page: number; limit: number; investor_id?: string } = {
      page,
      limit: 10,
    };
    if (includeInvestorParam && investorId) {
      params.investor_id = investorId;
    }
    return params;
  }, [includeInvestorParam, investorId, page]);

  const shouldSkip = includeInvestorParam ? !investorId : false;

  const { data, isLoading, isFetching, isError, refetch } = useListRiskAssessmentsQuery(queryArgs, {
    skip: shouldSkip,
  });

  const assessmentResponse = data as RiskAssessmentHistoryResponse | undefined;
  const totalAvailable = assessmentResponse?.data?.total ?? timeline.length;
  const hasMore = timeline.length < totalAvailable;

  useEffect(() => {
    if (shouldSkip) {
      setTimeline([]);
      setSelectedId(null);
    }
  }, [shouldSkip]);

  useEffect(() => {
    setPage(1);
    setTimeline([]);
    setSelectedId(null);
  }, [investorId, includeInvestorParam]);

  useEffect(() => {
    const list = assessmentResponse?.data?.list ?? [];
    if (!list.length) {
      if (page === 1 && !isFetching) {
        setTimeline([]);
        setSelectedId(null);
      }
      return;
    }

    setTimeline((prev) => {
      const base = page === 1 ? [] : prev;
      const map = new Map(base.map((entry) => [entry.id, entry]));
      list.forEach((entry) => map.set(entry.id, entry));
      const merged = Array.from(map.values());
      merged.sort((a, b) => {
        const aTime = new Date(a.completed_at ?? a.updated_at ?? a.started_at ?? 0).getTime();
        const bTime = new Date(b.completed_at ?? b.updated_at ?? b.started_at ?? 0).getTime();
        return bTime - aTime;
      });
      return merged;
    });
  }, [assessmentResponse, page, isFetching]);

  useEffect(() => {
    if (!timeline.length) {
      setSelectedId(null);
      return;
    }

    setSelectedId((prev) => {
      if (prev && timeline.some((entry) => entry.id === prev)) {
        return prev;
      }
      return timeline[0].id;
    });
  }, [timeline]);

  const selectedAssessment = useMemo(
    () => timeline.find((entry) => entry.id === selectedId) ?? null,
    [timeline, selectedId]
  );

  const snapshot = useMemo<SnapshotPayload | null>(
    () => (selectedAssessment ? buildSnapshotFromHistoryRow(selectedAssessment) : null),
    [selectedAssessment]
  );

  const responses = useMemo<SnapshotResponseItem[]>(
    () => (snapshot?.responses ? sortSnapshotResponses(snapshot.responses) : []),
    [snapshot]
  );

  const handleLoadMore = useCallback(() => {
    if (isFetching || !hasMore) return;
    setPage((prev) => prev + 1);
  }, [isFetching, hasMore]);

  const handleRefresh = useCallback(() => {
    if (page === 1) {
      refetch();
      return;
    }
    setPage(1);
  }, [page, refetch]);

  return (
    <CustomCard>
      <FlexRow justifyContent="space-between" alignItems="center">
        <Typography size="5" weight="medium">
          Risk Assessments
        </Typography>
        <FlexRow colGap={8}>
          <Button
            title="Refresh"
            variant="outline"
            onPress={handleRefresh}
            disabled={!investorId || isFetching}
            loading={isFetching && page === 1}
          />
          <Button
            title={hasMore ? "Load More" : "All Loaded"}
            onPress={handleLoadMore}
            disabled={!hasMore || isFetching}
            loading={isFetching && page > 1}
          />
        </FlexRow>
      </FlexRow>
      <Padding height={12} />

      {!investorId ? (
        <Typography size="2" color={themeColor.gray[9]}>
          Select an investor to view assessments.
        </Typography>
      ) : isLoading ? (
        <FlexRow justifyContent="center" style={{ minHeight: 120 }}>
          <ActivityIndicator color={themeColor.accent[9]} />
        </FlexRow>
      ) : isError ? (
        <Typography size="2" color={themeColor.red[9]}>
          Unable to fetch assessments.
        </Typography>
      ) : timeline.length === 0 ? (
        <EmptyResult message="No assessments found" style={{ minHeight: 120 }} />
      ) : (
        <View>
          <ScrollView style={{ maxHeight: 320 }}>
            {timeline.map((entry) => {
              const isActive = entry.id === selectedId;
              const isAbandoned = !entry.final_snapshot;
              return (
                <TouchableOpacity key={entry.id} onPress={() => setSelectedId(entry.id)}>
                  <CustomCard
                    style={{
                      marginBottom: 12,
                      borderWidth: 1,
                      borderColor: isActive ? themeColor.accent[9] : themeColor.gray[5],
                      backgroundColor: isActive ? themeColor.gray[3] : themeColor.gray[2],
                    }}
                  >
                    <Typography size="3" weight="medium">
                      {entry.risk_questionnaire?.name ?? "Risk Questionnaire"}
                    </Typography>
                    <Padding height={4} />
                    <Typography size="2" color={themeColor.gray[11]}>
                      {formatRiskAssessmentDateTime(entry.completed_at ?? entry.updated_at ?? entry.started_at)}
                    </Typography>
                    <Padding height={4} />
                    <FlexRow justifyContent="space-between" alignItems="center">
                      {isAbandoned ? (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 999,
                            backgroundColor: themeColor.red[2],
                          }}
                        >
                          <Typography size="1" color={themeColor.red[9]} weight="medium">
                            Abandoned
                          </Typography>
                        </View>
                      ) : (
                        <Typography size="2">Score: {entry.total_score ?? "-"}</Typography>
                      )}
                      <Typography size="2" color={themeColor.gray[11]}>
                        {entry.performed_by ?? "INVESTOR"}
                      </Typography>
                    </FlexRow>
                  </CustomCard>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Padding height={16} />

          {!selectedAssessment || !snapshot ? (
            <EmptyResult message="Select an assessment to view details" style={{ minHeight: 160 }} />
          ) : (
            <View>
              {(() => {
                const isAbandoned = !selectedAssessment.final_snapshot;
                return (
                  <CustomCard>
                    <Typography size="4" weight="medium">
                      {snapshot.questionnaire?.name ??
                        selectedAssessment.risk_questionnaire?.name ??
                        "Risk Questionnaire"}
                    </Typography>
                    <Padding height={8} />
                    <Typography size="2" color={themeColor.gray[11]}>
                      Version {snapshot.questionnaire?.version ?? selectedAssessment.snapshot_version ?? "-"}
                    </Typography>
                    {isAbandoned ? (
                      <>
                        <Padding height={8} />
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 999,
                            alignSelf: "flex-start",
                            backgroundColor: themeColor.red[2],
                          }}
                        >
                          <Typography size="1" color={themeColor.red[9]} weight="medium">
                            Abandoned
                          </Typography>
                        </View>
                        <Padding height={6} />
                        <Typography size="2" color={themeColor.gray[11]}>
                          This assessment was never submitted; the responses below are the last captured answers.
                        </Typography>
                        <Padding height={12} />
                      </>
                    ) : (
                      <Padding height={12} />
                    )}
                    <FlexRow wrap rowGap={12}>
                      <View style={{ width: "50%" }}>
                        <Typography size="1" color={themeColor.gray[11]}>
                          Performed By
                        </Typography>
                        <Padding height={4} />
                        <Typography size="3">{selectedAssessment.performed_by ?? "INVESTOR"}</Typography>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Typography size="1" color={themeColor.gray[11]}>
                          Completed At
                        </Typography>
                        <Padding height={4} />
                        <Typography size="3">
                          {formatRiskAssessmentDateTime(
                            selectedAssessment.completed_at ?? selectedAssessment.updated_at
                          )}
                        </Typography>
                      </View>
                      {isAbandoned ? null : (
                        <View style={{ width: "50%" }}>
                          <Typography size="1" color={themeColor.gray[11]}>
                            Total Score
                          </Typography>
                          <Padding height={4} />
                          <Typography size="3">{snapshot.total_score ?? "-"}</Typography>
                        </View>
                      )}
                      <View style={{ width: "50%" }}>
                        <Typography size="1" color={themeColor.gray[11]}>
                          Submitted At
                        </Typography>
                        <Padding height={4} />
                        <Typography size="3">{formatRiskAssessmentDateTime(snapshot.submitted_at)}</Typography>
                      </View>
                    </FlexRow>

                    {selectedAssessment?.investor_risk_bucket_assignment &&
                    selectedAssessment.investor_risk_bucket_assignment.length ? (
                      <>
                        <Padding height={12} />
                        <Typography size="2" weight="medium">
                          Bucket Assignment
                        </Typography>
                        <Padding height={8} />
                        <FlexRow colGap={12} rowGap={12} wrap>
                          {selectedAssessment.investor_risk_bucket_assignment.map((assign) => (
                            <CustomCard key={assign.id} style={{ minWidth: 220, maxWidth: 420 }}>
                              <FlexRow justifyContent="space-between" alignItems="center">
                                <Typography size="3" weight="medium">
                                  {assign.risk_bucket?.name ?? "Bucket"}
                                </Typography>
                                <Typography
                                  size="1"
                                  color={assign.is_active ? themeColor.green[9] : themeColor.gray[8]}
                                >
                                  {assign.is_active ? "Active" : "Inactive"}
                                </Typography>
                              </FlexRow>
                              <Padding height={6} />
                              <Typography size="1" color={themeColor.gray[11]}>
                                Code: {assign.risk_bucket?.code}
                              </Typography>
                              <Padding height={6} />
                              <Typography size="2" color={themeColor.gray[9]}>
                                Assigned by: {assign.assigned_by ?? "-"}
                              </Typography>
                              <Padding height={6} />
                              <FlexRow colGap={12}>
                                <Typography size="1" color={themeColor.gray[11]}>
                                  Score: {assign.total_score ?? "-"}
                                </Typography>
                                <Typography size="1" color={themeColor.gray[11]}>
                                  Version: {assign.bucket_version ?? assign.risk_bucket?.version ?? "-"}
                                </Typography>
                              </FlexRow>
                              <Padding height={6} />
                              <Typography size="1" color={themeColor.gray[11]}>
                                Assigned at: {formatRiskAssessmentDateTime(assign.assigned_at)}
                              </Typography>

                              <BucketAllocations
                                assetAllocation={assign.risk_bucket?.bucket_asset_allocation}
                                subAllocation={assign.risk_bucket?.bucket_sub_allocation}
                                header={{
                                  title: assign.risk_bucket?.name ?? "Recommended Asset Allocation",
                                  subtitle: assign.risk_bucket?.description ?? undefined,
                                  score: assign.total_score ?? snapshot?.total_score ?? undefined,
                                  outOf: 20,
                                }}
                              />
                            </CustomCard>
                          ))}
                        </FlexRow>
                      </>
                    ) : null}
                  </CustomCard>
                );
              })()}

              <Padding height={16} />

              <CustomCard>
                <Typography size="4" weight="medium">
                  Responses
                </Typography>
                <Padding height={12} />
                {responses.length === 0 ? (
                  <EmptyResult message="No answers captured" style={{ minHeight: 120 }} />
                ) : (
                  (() => {
                    const isAbandoned = !selectedAssessment.final_snapshot;
                    const defaultHeadingColor = themeColor.gray[12] ?? themeColor.gray[11];
                    const headingColor = isAbandoned
                      ? (themeColor.gray[10] ?? defaultHeadingColor)
                      : defaultHeadingColor;
                    const bodyColor = isAbandoned ? themeColor.gray[11] : undefined;

                    return (
                      <>
                        {isAbandoned ? (
                          <>
                            <Typography size="1" color={themeColor.gray[11]}>
                              These answers were recorded before the investor exited the flow.
                            </Typography>
                            <Padding height={8} />
                          </>
                        ) : null}
                        {responses.map((response) => (
                          <View key={`${response.question_id}-${response.question_order}`} style={{ marginBottom: 16 }}>
                            <Typography size="1" color={themeColor.gray[11]}>
                              Q{response.question_order}
                            </Typography>
                            <Padding height={4} />
                            <Typography size="3" weight="medium" color={headingColor}>
                              {response.question_text}
                            </Typography>
                            <Padding height={6} />
                            <Typography size="2" color={bodyColor}>
                              {response.selected_option?.label ? `${response.selected_option.label}. ` : null}
                              {response.selected_option?.text ?? "Not answered"}
                            </Typography>
                            <Typography size="1" color={themeColor.gray[11]}>
                              Points: {response.selected_option?.points ?? "-"}
                            </Typography>
                          </View>
                        ))}
                      </>
                    );
                  })()
                )}
              </CustomCard>
            </View>
          )}
        </View>
      )}
    </CustomCard>
  );
}

export default React.memo(RiskAssessmentHistory);
