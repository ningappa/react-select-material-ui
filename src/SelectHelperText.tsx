import * as React from "react";
import { isEmpty } from "lodash";
import FormHelperText, { FormHelperTextProps } from "@material-ui/core/FormHelperText/FormHelperText";

const SelectHelperText = (props: SelectHelperTextProps) => {
  const { id, helperText, formHelperTextProps, variant } = props;

  if (isEmpty(helperText)) {
    return null;
  }

  return (
    <FormHelperText id={id} {...formHelperTextProps} variant={variant}>
      {helperText}
    </FormHelperText>
  );
};

interface SelectHelperTextProps {
  id?: string;
  helperText?: React.ReactNode;
  formHelperTextProps?: Partial<FormHelperTextProps>;
  variant?: 'standard' | 'outlined' | 'filled';
}

export default SelectHelperText;
