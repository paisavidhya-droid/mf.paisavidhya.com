import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Fuse from "fuse.js";
import { AnimatePresence, MotiView } from "moti";
import { Control, Controller, RegisterOptions } from "react-hook-form";

import { dropDownValueType } from "@niveshstar/constant";
import { ThemeContext } from "@niveshstar/context";

import FlexRow from "./FlexRow";
import Typography from "./Typography";

interface optionsType {
  value: string | number;
  name: string | number;
}

interface PropsType {
  name: string;
  label?: string;
  height?: number;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  control: Control<any>;
  options: optionsType[];
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
  subtitleContent?: React.ReactNode;
}

function ControlledDropDown(props: PropsType) {
  const {
    name,
    options,
    control,
    rules = {},
    placeholder,
    label,
    disabled = false,
    isLoading = false,
    subtitleContent,
  } = props;

  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { themeColor } = useContext(ThemeContext);

  const fuse = useMemo(() => {
    const fuseOptions = {
      shouldSort: false,
      tokenize: true,
      matchAllTokens: true,
      threshold: 0.0,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["name"],
    };

    return new Fuse(options, fuseOptions);
  }, [options]);

  const filter = useCallback(() => {
    if (!query) return options;
    return fuse.search(query.trim());
    // return options.filter((option) => option.name.toString().toLowerCase().indexOf(query.toLowerCase()) > -1);
  }, [fuse, options, query]);

  const getDisplayValue = useCallback(
    (selectedVal: string) => {
      if (query) return query;
      if (selectedVal) return selectedVal;

      return "";
    },
    [query]
  );

  const renderOptions = useCallback(
    (onChange: (arg: any) => void, value: dropDownValueType) => {
      if (isLoading)
        return (
          <FlexRow justifyContent="center" alignItems="center" style={{ minHeight: 100 }}>
            <ActivityIndicator size={30} color={themeColor.accent[9]} />
          </FlexRow>
        );

      const result = filter();

      if (result.length === 0) {
        return <div className="option empty">No results found</div>;
      }

      return result.map((option, index) => {
        return (
          <div
            onClick={() => {
              setQuery(() => "");
              onChange(option);
              setIsOpen((isOpen) => !isOpen);
            }}
            className={`option ${option.name === value.name ? "selected" : ""}`}
            key={`${name}-${index}`}
          >
            {option.name}
          </div>
        );
      });
    },
    [filter, name, isLoading, themeColor]
  );

  useEffect(() => {
    if (!query) return;
    setIsOpen(true);
  }, [query]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .dropdown {
            position: relative;
            font: 14px "Inter", -apple-system,  BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: ${themeColor.gray[12]};
            cursor: default;
          }

          .control {
            position: relative;
          }
          
          .dropdown .arrow {
            border-color: ${themeColor.gray[6]} transparent transparent;
            border-style: solid;
            border-width: 5px 5px 0;
            content: " ";
            display: block;
            height: 0;
            margin-top: 0.3rem;
            position: absolute;
            right: 10px;
            top: 12px;
            width: 0;
            transition: transform 0.2s;
          }
          
          .dropdown .arrow.open {
            transform: rotateZ(180deg);
          }
          
          .dropdown .selected-value input {
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;
            border: 0.8px solid ${themeColor.gray[6]};
            border-radius: 6px;
            box-sizing: border-box;
            cursor: default;
            outline: none;
            padding: 6px 12px;
            transition: all 200ms ease;
            width: 100%;
            color: ${themeColor.gray[12]};
            background-color: ${themeColor.gray[1]};
          }

          .dropdown .selected-value input::placeholder {
            color: ${themeColor.gray[9]};
            line-height: 20px;
            font: 14px "Inter", -apple-system,  BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            opacity: 1;
          }
          
          .dropdown .options {
            padding: 5px;
            display: none;
            background-color: ${themeColor.gray[1]};
            border: 0.8px solid ${themeColor.gray[6]};
            box-shadow: 0 10px 38px -10px #16171859,0 10px 20px -15px #16171833;            
            box-sizing: border-box;
            margin-top: -1px;
            max-height: 200px;
            border-radius: 6px;
            overflow-y: auto;
            position: absolute;
            top: calc(100% - 14px);
            width: 100%;
            z-index: 1000;
            -webkit-overflow-scrolling: touch;
          }
          
          .dropdown .options.open {
            display: block;
          }
          
          .dropdown .option {
            box-sizing: border-box;
            color: ${themeColor.gray[12]};
            cursor: pointer;
            display: block;
            margin-bottom: 2px;
            padding: 4px 15px;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0.2px;
            border-radius: 3px;
          }

          .dropdown .option.empty {
            cursor: not-allowed;
          }
          
          .dropdown .option.selected {
            background-color: ${themeColor.accent[4]};
          }

          .dropdown .option:hover {
            background-color: ${themeColor.gray[4]};
          }`,
        }}
      />
      <Controller
        name={name}
        control={control}
        rules={{
          ...rules,
          validate: (v: optionsType) => {
            if (typeof rules.required === "object" && !rules.required.value) return true;
            if (v.value === 0) return true;
            if (!v.value && typeof rules.required === "object") return rules?.required?.message;
            // if (!v.value) return "Please select an option";
            if (rules.validate && typeof rules.validate === "function") return rules.validate(v, null);
            return true;
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div className="dropdown">
            <style
              dangerouslySetInnerHTML={{
                __html: () => {
                  return `
                  .dropdown .selected-value input::placeholder {
                    color: ${error ? themeColor.red[9] : themeColor.gray[9]};
                  }`;
                },
              }}
            />
            <View>
              {label ? (
                <Typography style={{ marginBottom: 4 }}>
                  {label}
                  {typeof rules.required === "object" && rules.required.value ? (
                    <Typography color={themeColor.red[11]}> *</Typography>
                  ) : null}
                </Typography>
              ) : null}
            </View>
            <div className="control">
              <div
                className="selected-value"
                style={{
                  borderWidth: "3px",
                  borderRadius: "9px",
                  borderStyle: "solid",
                  borderColor: isOpen ? (error ? themeColor.red["a7"] : themeColor.blue["a7"]) : "transparent",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={getDisplayValue(value.name)}
                  name="searchTerm"
                  placeholder={placeholder}
                  disabled={disabled}
                  autoComplete="off"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    onChange({ value: "", name: e.target.value });
                  }}
                  style={{
                    background: disabled ? themeColor.gray[3] : themeColor.gray[1],
                    borderColor: disabled ? themeColor.gray[1] : error ? themeColor.red["a7"] : themeColor.gray[6],
                    color: disabled ? themeColor.gray[8] : themeColor.gray[12],
                  }}
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                  // onFocus={() => { setIsOpen(true) }}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsOpen(false);
                    }, 200);
                  }}
                />
              </div>
              <div className={`arrow ${isOpen ? "open" : ""}`}></div>
            </div>
            <AnimatePresence>
              {isOpen ? (
                <MotiView
                  key={`dropDown-${name}`}
                  from={{ opacity: 0, translateY: 40 }}
                  animate={{ opacity: 1, translateY: 20 }}
                  exit={{ opacity: 0, translateY: 40 }}
                  transition={{ type: "timing", duration: 200 }}
                  style={{ zIndex: 999 }}
                >
                  <div className="options open">{renderOptions(onChange, value)}</div>
                </MotiView>
              ) : null}
            </AnimatePresence>
            <View style={{ height: 16 }}>
              {error?.message ? (
                <MotiView
                  from={{ opacity: 0, translateY: -5 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 300 }}
                >
                  <Typography size="1" color={themeColor.red[11]}>
                    {error.message}
                  </Typography>
                </MotiView>
              ) : (
                subtitleContent
              )}
            </View>
          </div>
        )}
      />
    </>
  );
}

export default React.memo(ControlledDropDown);
