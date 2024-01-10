import type * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import {useInputEvent} from '@conform-to/react';
import React, {useId, useRef} from 'react';
import {Input} from '@/components/ui/input.tsx';
import {Label} from '@/components/ui/label.tsx';
import {Checkbox, type CheckboxProps} from '@/components/ui/checkbox.tsx';
import {Textarea} from '@/components/ui/textarea.tsx';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group.tsx';
import {Combobox, type ComboboxProps} from '@/components/ui/combobox.tsx';

export type ListOfErrors = Array<string | null | undefined> | null | undefined;

export function ErrorList({id, errors}: {errors?: ListOfErrors; id?: string}) {
  const errorsToRender = errors?.filter(Boolean);
  if (!errorsToRender?.length) return null;
  return (
    <ul id={id} className="flex flex-col gap-1">
      {errorsToRender.map(e => (
        <li key={e} className="text-[10px] text-foreground-danger">
          {e}
        </li>
      ))}
    </ul>
  );
}

export function Field({
  labelProps,
  inputProps,
  errors,
  className,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  errors?: ListOfErrors;
  className?: string;
}) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <Label htmlFor={id} {...labelProps} />
      <Input
        id={id}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        {...inputProps}
      />
      <div className="min-h-[32px] px-4 pb-3 pt-1">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
      </div>
    </div>
  );
}

export function TextareaField({
  labelProps,
  textareaProps,
  errors,
  className,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  errors?: ListOfErrors;
  className?: string;
}) {
  const fallbackId = useId();
  const id = textareaProps.id ?? textareaProps.name ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <Label htmlFor={id} {...labelProps} />
      <Textarea
        id={id}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        {...textareaProps}
      />
      <div className="min-h-[32px] px-4 pb-3 pt-1">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
      </div>
    </div>
  );
}

export function ComboboxField({
  labelProps,
  comboboxProps,
  errors,
  className,
  options,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  comboboxProps: React.InputHTMLAttributes<HTMLInputElement> &
    Omit<ComboboxProps, 'options'>;
  errors?: ListOfErrors;
  className?: string;
  options: Array<{label: string; value: string}>;
}) {
  const {searchPlaceholder, placeholder, emptyPlaceholder, ...inputProps} =
    comboboxProps;
  const fallbackId = useId();
  const id = comboboxProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <Label htmlFor={id} {...labelProps} />
      <Combobox
        options={options}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        emptyPlaceholder={emptyPlaceholder}
        formInputProps={inputProps}
      />
      <div className="min-h-[32px] px-4 pb-3 pt-1">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
      </div>
    </div>
  );
}

export function RadioGroupField({
  labelProps,
  radiogroupProps,
  errors,
  className,
  options,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  radiogroupProps: React.ComponentPropsWithoutRef<
    typeof RadioGroupPrimitive.Root
  >;
  errors?: ListOfErrors;
  className?: string;
  options: Array<{label: string; value: string}>;
}) {
  const fallbackId = useId();
  const id = radiogroupProps.id ?? radiogroupProps.name ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <Label htmlFor={id} {...labelProps} />
      <RadioGroup className="flex gap-4" {...radiogroupProps}>
        {options.map(option => (
          <div
            key={option.value}
            className="flex items-center gap-1 [&>label]:text-[16px]"
          >
            <RadioGroupItem value={option.value} />
            <Label>{option.label} </Label>
          </div>
        ))}
      </RadioGroup>
      <div className="min-h-[32px] px-4 pb-3 pt-1">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
      </div>
    </div>
  );
}

export function CheckboxField({
  labelProps,
  buttonProps,
  errors,
  className,
}: {
  labelProps: JSX.IntrinsicElements['label'];
  buttonProps: CheckboxProps;
  errors?: ListOfErrors;
  className?: string;
}) {
  const fallbackId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  // To emulate native events that Conform listen to:
  // See https://conform.guide/integrations
  const control = useInputEvent({
    // Retrieve the checkbox element by name instead as Radix does not expose the internal checkbox element
    // See https://github.com/radix-ui/primitives/discussions/874
    ref: () =>
      buttonRef.current?.form?.elements.namedItem(buttonProps.name ?? ''),
    onFocus: () => buttonRef.current?.focus(),
  });
  const id = buttonProps.id ?? buttonProps.name ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <div className="flex gap-2">
        <Checkbox
          id={id}
          ref={buttonRef}
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          {...buttonProps}
          onCheckedChange={state => {
            control.change(Boolean(state.valueOf()));
            buttonProps.onCheckedChange?.(state);
          }}
          onFocus={event => {
            control.focus();
            buttonProps.onFocus?.(event);
          }}
          onBlur={event => {
            control.blur();
            buttonProps.onBlur?.(event);
          }}
          type="button"
        />
        <label
          htmlFor={id}
          {...labelProps}
          className="self-center text-body-xs text-muted-foreground"
        />
      </div>
      <div className="px-4 pb-3 pt-1">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
      </div>
    </div>
  );
}
