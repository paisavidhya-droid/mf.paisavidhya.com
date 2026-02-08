import React, { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";

import { portfoiloTypeOptions, riskTypeOptions } from "@niveshstar/constant";
import { usePatchBucketMutation, usePostBucketMutation } from "@niveshstar/context";
import { toastHelper } from "@niveshstar/utils";

import Button from "../../Button";
import Column from "../../Column";
import ControlledDropDown from "../../ControlledDropDown";
import ControlledInput from "../../ControlledInput";
import CustomCard from "../../CustomCard";
import CustomModal from "../../CustomModal";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import SchemeDropDown from "../../SchemeDropDown";
import Typography from "../../Typography";

interface PropsType {
  bucketData?: any;
  isModalVisible: boolean;
  closeModal: () => void;
}

const defaultValues = {
  title: "",
  description: "",
  type: { name: "", value: "" },
  risk_level: { name: "", value: "" },
  scheme_list: [],
  portfolio_amount: "",
  debit_date: { name: "", value: "" },
  duration: { name: "", value: "" },
};

function BucketForm(props: PropsType) {
  const { bucketData, closeModal, isModalVisible } = props;

  const hasPrefilledRef = useRef(false);

  const [patchBucketApi, { isLoading: isPatchingBucket }] = usePatchBucketMutation();
  const [postBucketApi, { isLoading: isPostingBucket }] = usePostBucketMutation();

  const { control, handleSubmit, setValue, reset, watch, clearErrors, setError, getValues } = useForm({
    defaultValues: defaultValues,
    reValidateMode: "onSubmit",
  });

  const schemeList = watch("scheme_list");

  const handleCloseModal = useCallback(() => {
    hasPrefilledRef.current = false;
    closeModal();
    reset();
  }, [closeModal, reset]);

  const handleAddScheme = useCallback(() => {
    const newField = { scheme: { name: "", value: "" }, allocation_perc: "" };
    const schemeList = getValues("scheme_list");
    const newSchemeData = [...schemeList, newField];
    setValue("scheme_list", newSchemeData);
  }, [setValue, getValues]);

  const handleRemoveScheme = useCallback(
    (index: number) => {
      const schemeList = getValues("scheme_list");
      const newSchemeData = [...schemeList];
      newSchemeData.splice(index, 1);
      setValue("scheme_list", newSchemeData);
    },
    [getValues, setValue]
  );

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        clearErrors();

        const schemeList = data.scheme_list;
        const totalPercent = schemeList.reduce((acc, val) => parseFloat(val.allocation_perc) + acc, 0);
        if (totalPercent !== 100 || schemeList.length < 3) {
          schemeList.forEach((_, index) => {
            if (totalPercent !== 100)
              setError(`scheme_list.${index}.allocation_perc`, { message: "Allocation percent should sum upto 100" });
          });
          if (schemeList.length < 3) toastHelper("error", "Add atleast three schemes");
          return;
        }

        const schemes = data.scheme_list.map((val) => ({
          scheme_id: val.scheme.value.id,
          allocation_perc: parseFloat(val.allocation_perc),
        }));

        const payload: any = {
          id: bucketData && bucketData.id ? bucketData.id : undefined,
          is_recommended: true,
          title: data.title,
          description: data.description,
          investment_mode: data.type.value,
          risk_level: data.risk_level.value,
          schemes: schemes,
        };

        if (payload.id) await patchBucketApi(payload).unwrap();
        else await postBucketApi(payload).unwrap();

        closeModal();
      } catch {
        //do nothing
      }
    },
    [postBucketApi, patchBucketApi, setError, clearErrors, closeModal, bucketData]
  );

  useEffect(() => {
    if (hasPrefilledRef.current || !bucketData) return;

    setValue("title", bucketData.title);
    setValue("description", bucketData.description);

    const type = portfoiloTypeOptions.filter((val) => val.value === bucketData.investment_mode);
    setValue("type", type[0]);

    const riskLevel = riskTypeOptions.filter((val) => val.value === bucketData.risk_level);
    setValue("risk_level", riskLevel[0]);

    const schemeList = bucketData.bucket_schemes.map((val: any) => ({
      scheme: { name: val.scheme_name, value: { id: val.id } },
      allocation_perc: val.allocation_perc,
    }));

    setValue("scheme_list", schemeList);
    //
  }, [setValue, hasPrefilledRef, bucketData]);

  return (
    <CustomModal
      title={bucketData ? "Update" : "Add"}
      minWidth={500}
      maxWidth={500}
      heightPercent={70}
      closeModal={handleCloseModal}
      isModalVisible={isModalVisible}
      onConfirm={handleSubmit(onSubmit)}
      footerTitle={bucketData ? "Update" : "Add"}
      primaryBtnProps={{
        disabled: isPostingBucket || isPatchingBucket,
        loading: isPostingBucket || isPatchingBucket,
      }}
    >
      <FlexRow rowGap={16} wrap>
        <Column col={24}>
          <ControlledInput
            name="title"
            label="Title"
            control={control}
            placeholder="Enter title"
            rules={{
              required: {
                value: true,
                message: "Please enter title",
              },
            }}
          />
        </Column>

        <FlexRow colGap={16} style={{ zIndex: 1 }}>
          <ControlledDropDown
            control={control}
            name="type"
            label="Portfolio Type"
            options={portfoiloTypeOptions}
            placeholder="Select Portfolio Type"
            rules={{
              required: {
                value: true,
                message: "Please select portfolio type",
              },
            }}
          />

          <ControlledDropDown
            control={control}
            name="risk_level"
            label="Risk Type"
            options={riskTypeOptions}
            placeholder="Select Risk Type"
            rules={{
              required: {
                value: true,
                message: "Please select risk type",
              },
            }}
          />
        </FlexRow>

        <Column col={24}>
          <ControlledInput
            multiline
            numberOfLines={4}
            control={control}
            name="description"
            label="Description"
            placeholder="Enter description"
            rules={{
              required: {
                value: true,
                message: "Please enter description",
              },
            }}
          />
        </Column>

        <FlexRow>
          <Button variant="soft" title="Add Scheme" onPress={handleAddScheme} />
        </FlexRow>
        <Padding height={12} />

        {schemeList.map((val, index) => (
          <View key={index} style={{ zIndex: schemeList.length - index, marginBottom: 12, flexGrow: 1 }}>
            <CustomCard>
              <FlexRow alignItems="center" justifyContent="space-between">
                <Typography size="3">Scheme #{index + 1}</Typography>
                <Button variant="outline" color="danger" title="Remove" onPress={() => handleRemoveScheme(index)} />
              </FlexRow>
              <Padding height={16} />

              <FlexRow offset={4}>
                <Column col={16} offset={4}>
                  <SchemeDropDown
                    type="PURCHASE"
                    name={`scheme_list.${index}.scheme`}
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please select scheme",
                      },
                    }}
                  />
                </Column>
                <Column col={8} offset={4}>
                  <ControlledInput
                    control={control}
                    label="Allocation (%)"
                    keyboardType="numeric"
                    inputMode="numeric"
                    placeholder="Enter Allocation Percentage"
                    name={`scheme_list.${index}.allocation_perc`}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter allocation percentage",
                      },
                    }}
                  />
                </Column>
              </FlexRow>
            </CustomCard>
          </View>
        ))}
      </FlexRow>
    </CustomModal>
  );
}

export default React.memo(BucketForm);
