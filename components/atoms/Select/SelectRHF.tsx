import { Control, Controller, FieldValues, Path } from "react-hook-form";

import SelectCustom, { SelectProps } from "./Select";

type SelectRHFProps<T extends FieldValues> = SelectProps & {
  control: Control<T>;
  name: Path<T>;
};

export const SelectRHF = <T extends FieldValues>({
  control,
  name,
  onValueChange,
  ...props
}: SelectRHFProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ref } }) => (
        <SelectCustom
          {...props}
          onValueChange={v => {
            onChange(v);
            onValueChange?.(v);
          }}
          value={value}
          ref={ref}
        />
      )}
    />
  );
};

export default SelectRHF;
