/* eslint-disable react/prop-types */

'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { twMerge } from 'tailwind-merge';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={twMerge(
      'border-b border-x border-secondary rounded-b-lg data-[state=closed]:hover:border-primary/50 transition-colors duration-500 data-[state=closed]:hover:duration-100',
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={twMerge(
        'flex flex-1 items-center justify-between font-medium transition-all [&[data-state=open]>svg]:rotate-180 data-[state=open]:hover:underline',
        className
      )}
      {...props}
    >
      {children}
      {!props.disabled && (
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden no-scrollbar text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={twMerge('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

interface CustomAccordionProps {
  children: JSX.Element;
  triggerText: string;
}

function CustomAccordion({ triggerText, children }: CustomAccordionProps) {
  return (
    <Accordion type="single" collapsible className="mt-4">
      <AccordionItem value="item-1">
        <AccordionTrigger className="justify-center gap-2 pb-2 text-sm bg-transparent">
          {triggerText}
        </AccordionTrigger>
        <AccordionContent className="p-2">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export {
  Accordion,
  CustomAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};
