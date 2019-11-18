import * as React from 'react';
import Input from "@material-ui/core/Input";
import FilledInput from  "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";

import SelectCreatable, { CreatableProps } from 'react-select/lib/Creatable';
import SelectReadOnly from 'react-select';
import { getStyles } from './SelectDropdownStyles';
import {
	isArray,
	isEmpty,
	isNil,
	some,
	toString
	} from 'lodash';
import { Props as ReactSelectProps } from 'react-select/lib/Select';
const variantComponent = {
	standard: Input,
	filled: FilledInput,
	outlined: OutlinedInput,
  };
	
class SelectDropdown extends React.Component<SelectDropdownProps> {
	private static spaces: RegExp = /\s/;
	private static SENSITIVITY: Intl.CollatorOptions = { sensitivity: 'base' };

	public render() {
		const { hasInputFocus, value, placeholder, options, selectProps, onChange, onFocus, onBlur, variant } = this.props;

		variantComponent[variant];
		const Select: React.ComponentClass<any> =
			selectProps && selectProps.isCreatable ? SelectCreatable : SelectReadOnly;

		return (
			<Select
				isValidNewOption={this.isValidNewOption}
				captureMenuScroll={false}
				createOptionPosition="first"
				{...selectProps}
				value={value}
				placeholder={placeholder}
				options={options}
				styles={getStyles(selectProps, hasInputFocus)}
				noOptionsMessage={this.noOptionsMessage}
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
		);
	}

	private noOptionsMessage = (obj: { inputValue: string }) => {
		const { selectProps } = this.props;

		if (isNil(selectProps)) {
			return null;
		}

		if (isEmpty(obj) || isEmpty(obj.inputValue)) {
			return selectProps.msgNoOptionsAvailable || 'No more options are available';
		}

		const { inputValue } = obj;

		if (selectProps.isCreatable !== true || this.containsValue(inputValue) || this.containsOptions(inputValue)) {
			return selectProps.msgNoOptionsMatchFilter || 'No options match the filter';
		}

		return selectProps.msgNoValidValue || 'The new value is not valid (contains space)';
	};

	private isValidNewOption = (inputValue: string) => {
		if (isEmpty(inputValue)) {
			return false;
		}

		if (this.containsOptions(inputValue)) {
			return false;
		}

		const hasSpaces = SelectDropdown.spaces.test(inputValue);
		return hasSpaces === false;
	};

	private containsOptions(inputValue: string): boolean {
		return some(this.props.options, (option: SelectOption) => this.equalsIgnoringCase(inputValue, option.value));
	}

	private containsValue(inputValue: string): boolean {
		const { value } = this.props;

		if (isArray(value) === false) {
			return false;
		}

		return some(value, (option: SelectOption) => this.equalsIgnoringCase(inputValue, option.value));
	}

	private equalsIgnoringCase(a: string, b: SelectOptionValue) {
		return a.localeCompare(toString(b), undefined, SelectDropdown.SENSITIVITY) === 0;
	}
}

export interface SelectDropdownProps {
	value?: SelectOption | SelectOption[] | null;
	placeholder?: string;
	options?: SelectOption[];
	selectProps?: SelectProps;
    hasInputFocus?: boolean;
	onChange?: (value: SelectOption | SelectOption[] | null) => void;
	onFocus?: (event: any) => void;
	onBlur?: (event: any) => void;
}

export interface SelectProps extends ReactSelectProps<SelectOption>, CreatableProps<SelectOption> {
	isCreatable?: boolean;
	msgNoOptionsAvailable?: string;
	msgNoOptionsMatchFilter?: string;
	msgNoValidValue?: string;
}

export interface SelectOption {
	label: string;
	options?: SelectOption[];
	value?: SelectOptionValue;
}

export type SelectOptionValue = any;

export default SelectDropdown;
