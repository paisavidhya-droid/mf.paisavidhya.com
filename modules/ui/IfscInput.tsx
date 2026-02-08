import React, { useCallback, useState } from "react";
import { Control } from "react-hook-form";

import { useLazyGetIfscDetailsQuery } from "@niveshstar/context";

import ControlledInput from "./ControlledInput";
import Padding from "./Padding";

interface PropsType {
  control: Control<any>;
  bank_name?: string;
  ifsc_code?: string;
  branch_name?: string;
  branch_address?: string;
  setValue: (name: string, value: any) => void;
}

function IfscInput(props: PropsType) {
  const {
    control,
    setValue,
    bank_name = "bank_name",
    branch_name = "branch_name",
    branch_address = "branch_address",
    ifsc_code = "ifsc_code",
  } = props;

  const [showFields, setShowFields] = useState(false);

  const [getIfscDetailsApi] = useLazyGetIfscDetailsQuery();

  const getIfscDetails = useCallback(
    async (ifscCode: string) => {
      try {
        const res = await getIfscDetailsApi(ifscCode).unwrap();

        setValue(bank_name, res.BANK);
        setValue(branch_name, res.BRANCH);
        setValue(branch_address, res.ADDRESS);
        setShowFields(true);

        return true;
      } catch {
        setValue(bank_name, "");
        setValue(branch_name, "");
        setValue(branch_address, "");
        return "Invalid IFSC code";
      }
    },
    [setValue, getIfscDetailsApi, bank_name, branch_address, branch_name]
  );

  return (
    <>
      <ControlledInput
        key="ifsc_code"
        label="IFSC Code"
        name={ifsc_code}
        control={control}
        placeholder="Enter IFSC Code"
        rules={{
          required: {
            value: true,
            message: "Please enter IFSC code",
          },
          validate: (val: string) => {
            if (!val || val.length !== 11) {
              if (showFields) setShowFields(false);
              return "Invalid IFSC code";
            }

            return getIfscDetails(val);
          },
        }}
      />
      {!showFields ? null : (
        <>
          <Padding height={16} />
          <ControlledInput
            disabled
            key="bank_name"
            label="Bank Name"
            name={bank_name}
            control={control}
            placeholder="Enter Bank Name"
            rules={{
              required: {
                value: true,
                message: "Please enter bank name",
              },
            }}
          />
        </>
      )}
      {!showFields ? null : (
        <>
          <Padding height={16} />
          <ControlledInput
            disabled
            key="branch_name"
            label="Branch Name"
            name={branch_name}
            control={control}
            placeholder="Enter Branch Name"
            rules={{
              required: {
                value: true,
                message: "Please enter branch name",
              },
            }}
          />

          <Padding height={16} />
          <ControlledInput
            disabled
            numberOfLines={4}
            key="branch_address"
            label="Branch Address"
            name={branch_address}
            control={control}
            placeholder="Enter Branch Address"
            rules={{
              required: {
                value: true,
                message: "Please enter branch address",
              },
            }}
          />
        </>
      )}
    </>
  );
}

export default React.memo(IfscInput);
