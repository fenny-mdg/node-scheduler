'use client';

import * as React from 'react';
import {Check, ChevronsUpDown} from 'lucide-react';

import {cn} from '@/lib/utils.ts';
import {Button} from '@/components/ui/button.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';

export type ComboboxProps = {
  placeholder?: string;
  searchPlaceholder?: string;
  emptyPlaceholder?: string;
  options: Array<{label: string; value: string}>;
  formInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export function Combobox({
  options,
  placeholder = '',
  searchPlaceholder = '',
  emptyPlaceholder = '',
  formInputProps,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded"
        >
          {value
            ? options.find(
                options => options.value.toLowerCase() === value.toLowerCase(),
              )?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          {formInputProps ? (
            <input
              {...formInputProps}
              value={value}
              className="hidden"
              readOnly
            />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-96 p-0">
        <Command value={value}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
          <CommandGroup className="overflow-scroll">
            {options.map(option => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue: string) => {
                  setValue(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === option.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
