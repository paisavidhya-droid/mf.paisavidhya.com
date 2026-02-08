import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { useForm } from "react-hook-form";

import { redeemByOptions } from "@niveshstar/constant";
import {
  ThemeContext,
  useLazyGetRedemptionSchemeByIdQuery,
  usePatchCartMutation,
  usePostCartMutation,
} from "@niveshstar/context";
import { useNavigation } from "@niveshstar/hook";
import { convertCurrencyToString, toastHelper } from "@niveshstar/utils";

import ControlledDropDown from "../../ControlledDropDown";
import ControlledInput from "../../ControlledInput";
import ControlledRadio from "../../ControlledRadio";
import CustomModal from "../../CustomModal";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import SchemeDropDown from "../../SchemeDropDown";
import Typography from "../../Typography";

interface PropsType {
  schemeId?: string;
  isModalVisible: boolean;
  closeModal: () => void;
  cartData?: any;
}

const defaultValues = {
  amount: "",
  units: "",
  folio: { name: "", value: null },
  scheme: { name: "", value: null },
  redemption_by: { name: "", value: "" },
};

function RedeemForm(props: PropsType) {
  const { schemeId, isModalVisible, closeModal, cartData = null } = props;

  const { params } = useNavigation();
  const hasPrefilledRef = useRef(false);
  const { themeColor } = useContext(ThemeContext);

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const redeemBy = watch("redemption_by");
  const selectedScheme = watch("scheme");
  const selectedFolio = watch("folio");

  const [postCartApi, { isLoading: isPostingCart }] = usePostCartMutation();
  const [patchCartApi, { isLoading: isPatchingCart }] = usePatchCartMutation();
  const [getRedemptionSchemeByIdApi, { isLoading: isGettingSchemeById }] = useLazyGetRedemptionSchemeByIdQuery();

  const handleCloseModal = useCallback(() => {
    hasPrefilledRef.current = false;
    closeModal();
    reset();
  }, [closeModal, reset]);

  const handleConfirm = useCallback(
    async (data: typeof defaultValues) => {
      try {
        const totalUnits = data.folio.value.total_units;
        const isUnits = data.redemption_by.value !== "AMOUNT";
        const amount = data.redemption_by.value === "ALL_UNITS" ? totalUnits : isUnits ? data.units : data.amount;

        const availableAmount = data.folio.value.total_investment_amount - data.folio.value.amount_on_hold;
        const availableUnits = data.folio.value.total_units - data.folio.value.units_on_hold;

        if (availableAmount <= 0 || availableUnits <= 0) {
          toastHelper("error", "No amount/units to redeem");
          return;
        }

        const payload = {
          type: "ORDER",
          order_type: "REDEMPTION",
          scheme_id: data.scheme.value.scheme_id,
          folio: data.folio.value.folio,
          amount: amount,
          is_units: isUnits,
        };

        if (cartData) {
          await patchCartApi({ id: cartData.id, payload: payload }).unwrap();
          setTimeout(() => {
            toastHelper("success", "Updated");
          }, 300);
        } else {
          await await postCartApi({ investorId: params.investorId, payload: payload }).unwrap();
          setTimeout(() => {
            toastHelper("success", "Added to cart");
          }, 300);
        }

        handleCloseModal();
      } catch {
        //pass
      }
    },
    [postCartApi, handleCloseModal, params, patchCartApi, cartData]
  );

  const getRedemptionSchemeById = useCallback(
    async (schemeId: string) => {
      try {
        const res = await getRedemptionSchemeByIdApi({ schemeId: schemeId }).unwrap();
        setValue("scheme", { name: res.data.name, value: res.data });
      } catch {
        //pass
      }
    },
    [getRedemptionSchemeByIdApi, setValue]
  );

  const folioOptions = useMemo(() => {
    if (!selectedScheme || !selectedScheme.value) return [];

    return selectedScheme.value.folios.map((val: any) => {
      const amount = Math.max(Math.round((val.total_investment_amount - val.amount_on_hold) * 100) / 100, 0);
      const units = val.total_units - val.units_on_hold;
      return {
        name: `${val.folio} | ${convertCurrencyToString(amount)} | ${units} Units`,
        value: val,
      };
    });
  }, [selectedScheme]);

  const { minAmount, minUnits, maxAmount, maxUnits } = useMemo(() => {
    let [minAmount, minUnits, maxAmount, maxUnits] = [-1, -1, -1, -1];
    if (selectedScheme.value) {
      minAmount = selectedScheme.value?.redemption?.min_amt;
      minUnits = selectedScheme.value?.redemption?.min_unit;
    }

    if (selectedFolio.value) {
      maxAmount = Math.max(selectedFolio.value?.total_investment_amount - selectedFolio.value?.amount_on_hold, 0);
      maxUnits = Math.max(selectedFolio.value?.total_units - selectedFolio.value?.units_on_hold, 0);
    }

    return { minAmount, minUnits, maxAmount, maxUnits };
  }, [selectedFolio, selectedScheme]);

  useEffect(() => {
    //reset form when scheme changes
    if (hasPrefilledRef.current) return;
    setValue("folio", { name: "", value: null });
    setValue("redemption_by", { name: "", value: "" });
  }, [selectedScheme, setValue]);

  useEffect(() => {
    //reset form when scheme changes
    if (hasPrefilledRef.current) return;
    setValue("amount", "");
    setValue("units", "");
  }, [selectedFolio, setValue]);

  useEffect(() => {
    if (!schemeId || !isModalVisible) return;
    getRedemptionSchemeById(schemeId);
  }, [schemeId, getRedemptionSchemeById, isModalVisible]);

  useEffect(() => {
    if (hasPrefilledRef.current || !cartData || !selectedScheme?.value || folioOptions.length === 0) return;

    const folio = folioOptions.find((val: any) => val.value.folio === cartData.folio);
    if (!folio) return;

    setValue("folio", folio);

    const redemptionBy = cartData.is_units ? "UNITS" : "AMOUNT";
    setValue("redemption_by", {
      name: redemptionBy,
      value: redemptionBy,
    });

    if (cartData.is_units) setValue("units", cartData.amount);
    else setValue("amount", cartData.amount);

    hasPrefilledRef.current = true;
    //
  }, [cartData, selectedScheme, folioOptions, setValue]);

  return (
    <CustomModal
      title={cartData ? "Update" : "Redeem"}
      minWidth={500}
      maxWidth={500}
      heightPercent={70}
      closeModal={handleCloseModal}
      isModalVisible={isModalVisible}
      onConfirm={handleSubmit(handleConfirm)}
      footerTitle={cartData ? "Update" : "Add to Cart"}
      primaryBtnProps={{
        disabled: isPostingCart || isPatchingCart || isGettingSchemeById || maxUnits === 0 || maxAmount === 0,
        loading: isPostingCart || isPatchingCart,
      }}
    >
      <View style={{ minHeight: 400 }}>
        {isGettingSchemeById ? (
          <FlexRow justifyContent="center" alignItems="center" style={{ flexGrow: 1 }}>
            <ActivityIndicator size={40} color={themeColor.accent[9]} />
          </FlexRow>
        ) : (
          <>
            {schemeId ? (
              <ControlledInput
                disabled
                multiline
                label="Scheme"
                control={control}
                name="scheme"
                value={selectedScheme?.name}
                rules={{
                  required: {
                    value: true,
                    message: "Please select a scheme",
                  },
                }}
              />
            ) : (
              <SchemeDropDown
                control={control}
                type="REDEEM"
                name="scheme"
                rules={{
                  required: {
                    value: true,
                    message: "Please select a scheme",
                  },
                }}
              />
            )}

            <Padding height={16} />

            <ControlledDropDown
              control={control}
              label="Folio"
              name="folio"
              placeholder="Select Folio"
              options={folioOptions}
              rules={{
                required: {
                  value: true,
                  message: "Please select folio",
                },
              }}
            />

            {selectedFolio?.value?.units_on_hold ? (
              <>
                <Typography size="1" color={themeColor.gray[11]}>
                  {selectedFolio.value.units_on_hold} units /{" "}
                  {convertCurrencyToString(selectedFolio.value.amount_on_hold)} is currently on hold. This includes
                  units from pending redemption orders and units added to your cart.
                </Typography>
                <Padding height={16} />
              </>
            ) : (
              <Padding height={16} />
            )}

            <ControlledRadio
              control={control}
              name="redemption_by"
              label="Select redemption by"
              options={redeemByOptions}
              rules={{
                required: {
                  value: true,
                  message: "Please select redemption by",
                },
              }}
            />

            {redeemBy.value === "UNITS" ? (
              <>
                <Padding height={16} />
                <ControlledInput
                  name="units"
                  control={control}
                  label="Redemption Units"
                  placeholder="Enter Units"
                  disabled={!selectedFolio.value || !selectedScheme.value || maxUnits === 0}
                  subtitleContent={
                    maxUnits == -1 ? null : (
                      <Typography size="1" color={themeColor.gray[9]} weight="light" align="right">
                        Max Units: {maxUnits}
                      </Typography>
                    )
                  }
                  rules={{
                    required: {
                      value: true,
                      message: "Please enter units",
                    },
                    max: {
                      value: maxUnits,
                      message: `Please enter value below or equal ${maxUnits}`,
                    },
                    min: {
                      value: minUnits,
                      message: `Please enter value above or equal ${minUnits}`,
                    },
                  }}
                />
              </>
            ) : null}

            {redeemBy.value === "AMOUNT" ? (
              <>
                <Padding height={16} />
                <ControlledInput
                  name="amount"
                  control={control}
                  label="Redemption Amount"
                  placeholder="Enter Redemption Amount"
                  disabled={!selectedFolio.value || !selectedScheme.value || maxAmount === 0}
                  subtitleContent={
                    maxAmount == -1 ? null : (
                      <Typography size="1" color={themeColor.gray[9]} weight="light" align="right">
                        Max Amount: {maxAmount}
                      </Typography>
                    )
                  }
                  rules={{
                    required: {
                      value: true,
                      message: "Please enter amount",
                    },
                    max: {
                      value: maxAmount,
                      message: `Please enter value below or equal to ${maxAmount}`,
                    },
                    min: {
                      value: minAmount,
                      message: `Please enter value above or equal to ${minAmount}`,
                    },
                  }}
                />
              </>
            ) : null}
          </>
        )}
      </View>
    </CustomModal>
  );
}

export default React.memo(RedeemForm);
