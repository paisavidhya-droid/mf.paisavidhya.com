import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import { ThemeContext } from "@niveshstar/context";

import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";
import type { BucketAssetAllocationItem, BucketSubAllocationItem } from "./history";

type Variant = "chips" | "list" | "chart";

type Header = {
  title?: string;
  subtitle?: string;
  score?: number | null;
  outOf?: number | null;
};

type Props = {
  assetAllocation?: BucketAssetAllocationItem[];
  subAllocation?: BucketSubAllocationItem[];
  variant?: Variant;
  header?: Header;
};

function parsePercentage(v?: string | number) {
  if (v == null) return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function BucketAllocations({ assetAllocation, subAllocation, variant = "chart", header }: Props) {
  const { themeColor } = useContext(ThemeContext);

  const renderChips = (items: (BucketAssetAllocationItem | BucketSubAllocationItem)[], labelKey: string) => (
    <FlexRow colGap={8} rowGap={8} wrap>
      {items.map((it: any) => (
        <View
          key={it.id}
          style={[styles.chip, { backgroundColor: themeColor.gray[3], borderColor: themeColor.gray[5] }]}
        >
          <Typography size="1" color={themeColor.gray[11]}>
            {labelKey === "asset" ? it.asset_class : it.sub_asset}
            {": "}
            {it.target_percentage}
            {it.target_percentage?.toString().endsWith("%") ? "" : "%"}
          </Typography>
        </View>
      ))}
    </FlexRow>
  );

  const renderList = (items: (BucketAssetAllocationItem | BucketSubAllocationItem)[], labelKey: string) => (
    <FlexRow colGap={12} wrap>
      {items.map((it: any) => (
        <Typography key={it.id} size="1" color={themeColor.gray[9]}>
          {labelKey === "asset" ? it.asset_class : it.sub_asset}: {it.target_percentage}
          {it.target_percentage?.toString().endsWith("%") ? "" : "%"}
        </Typography>
      ))}
    </FlexRow>
  );

  const renderChart = (items: any[] = [], labelKey: "asset" | "sub" = "asset") => {
    const parsed = items.map((a) => ({ ...a, p: parsePercentage(a.target_percentage) }));
    const total = parsed.reduce((s, x) => s + x.p, 0) || 100;
    const colors = [
      themeColor.accent[6],
      themeColor.green[6],
      themeColor.gray[6],
      themeColor.gray[7],
      themeColor.gray[8],
    ];

    return (
      <>
        <View style={[styles.chartBar, { backgroundColor: themeColor.gray[3] }]}>
          {parsed.map((seg, idx) => {
            return (
              <View
                key={seg.id}
                style={{ flex: seg.p, height: "100%", backgroundColor: colors[idx % colors.length] }}
              />
            );
          })}
        </View>
        <Padding height={6} />
        <FlexRow colGap={8} rowGap={6} wrap>
          {parsed.map((seg, idx) => (
            <View key={seg.id} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: colors[idx % colors.length],
                  borderRadius: 2,
                  marginRight: 6,
                }}
              />
              <Typography size="1" color={themeColor.gray[9]}>
                {(labelKey === "asset" ? seg.asset_class : seg.sub_asset) || seg.asset_class}: {seg.p}%
              </Typography>
            </View>
          ))}
        </FlexRow>
      </>
    );
  };

  return (
    <>
      {assetAllocation && assetAllocation.length > 0 && (
        <>
          {/* Two-column layout: description on left, allocation (chart/chips/list) on right */}
          <FlexRow alignItems="flex-start" wrap>
            <View style={{ flex: 1, minWidth: 220 }}>
              {header ? (
                <>
                  {header.title ? (
                    <Typography size="2" weight="medium">
                      {header.title}
                    </Typography>
                  ) : null}
                  {header.subtitle ? (
                    <Typography size="1" color={themeColor.gray[11]} style={{ lineHeight: 18 }}>
                      {header.subtitle}
                    </Typography>
                  ) : null}
                </>
              ) : (
                <>
                  <Typography size="1" weight="medium">
                    Asset Allocation
                  </Typography>
                </>
              )}
            </View>

            <View style={{ minWidth: 220, maxWidth: 360, marginLeft: 12, flexShrink: 0 }}>
              {typeof header?.score === "number" ? (
                <View style={{ alignItems: "flex-end" }}>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: themeColor.gray[3],
                    }}
                  >
                    <Typography size="2" weight="medium">
                      {header!.score}/{header!.outOf ?? 20}
                    </Typography>
                  </View>
                </View>
              ) : null}

              <Padding height={8} />

              <View style={{ maxWidth: "100%", overflow: "hidden" }}>
                {variant === "chips" && renderChips(assetAllocation, "asset")}
                {variant === "list" && renderList(assetAllocation, "asset")}
                {variant === "chart" && renderChart(assetAllocation)}
              </View>

              {/* Sub allocations (moved here to keep UI compact) */}
              {subAllocation && subAllocation.length > 0 && (
                <>
                  <Padding height={8} />
                  <Typography size="1" weight="medium">
                    Sub Allocation
                  </Typography>
                  <Padding height={6} />

                  <View style={{ maxWidth: "100%", overflow: "hidden" }}>
                    {variant === "chart"
                      ? (() => {
                          const groups = (subAllocation || []).reduce(
                            (acc: any, s: any) => {
                              (acc[s.asset_class] = acc[s.asset_class] || []).push(s);
                              return acc;
                            },
                            {} as Record<string, any[]>
                          );

                          return Object.entries(groups).map(([asset, items]) => (
                            <View key={asset} style={{ marginBottom: 8 }}>
                              <Typography size="1" weight="medium">
                                {asset}
                              </Typography>
                              <Padding height={4} />
                              {renderChart(items as any[], "sub")}
                            </View>
                          ));
                        })()
                      : variant === "chips"
                        ? renderChips(subAllocation, "sub")
                        : (() => {
                            const groups = (subAllocation || []).reduce(
                              (acc: any, s: any) => {
                                (acc[s.asset_class] = acc[s.asset_class] || []).push(s);
                                return acc;
                              },
                              {} as Record<string, any[]>
                            );

                            return Object.entries(groups).map(([asset, items]) => (
                              <View key={asset} style={{ marginBottom: 8 }}>
                                <Typography size="1" weight="medium">
                                  {asset}
                                </Typography>
                                <Padding height={4} />
                                {renderList(items as BucketSubAllocationItem[], "sub")}
                              </View>
                            ));
                          })()}
                  </View>
                </>
              )}
            </View>
          </FlexRow>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  chartBar: {
    width: "100%",
    minWidth: 0,
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    flexDirection: "row",
  },
});

export default React.memo(BucketAllocations);
