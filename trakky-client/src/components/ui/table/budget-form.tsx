"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  Field,
  FormField,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardFormFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import React from "react";
import axios from "axios";
import { formToast } from "@/components/ui/use-toast.ts";
import { AddBudgets, Budget, EditBudget } from "@/infrastructure/budget.tsx";
import { firstOfTheMonthDateString } from "@/lib/formatter.ts";

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    return { message: "" };
  }
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: "" };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);



axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export function BudgetForm({
  title,
  refresh,
  existingDates,
  editValues,
}: {
  title: string;
  refresh: (flushBeforeRefresh: boolean) => void;
  existingDates: Date[];
  editValues?: Budget;
}) {

  const formSchema = z.object({
    id: z.number().optional(),
    date: z.date().refine((val) => !existingDates.some((date) => date.getTime() === new Date(firstOfTheMonthDateString(val)).getTime()), {
      message: "Budget for this date already exists!",
    }),
    budget: z.number().refine((val) => val !== 0, {
      message: "cannot be 0",
    }),
    maxBudget: z.number().refine((val) => val !== 0, {
      message: "cannot be 0",
    }),
  });

  const [isError, setIsError] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: editValues?.id === undefined ? undefined : Number(editValues?.id),
      date:
        editValues?.date === undefined
          ? new Date()
          : new Date(editValues?.date),
      budget: editValues?.budget === undefined ? 0 : Number(editValues?.budget),
      maxBudget:
        editValues?.maxBudget === undefined
          ? 0
          : Number(editValues?.maxBudget),
  }});

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsError(false);
    console.log(values);

    let success: boolean;

    if (editValues === undefined) {
      const budget = values as unknown as Budget;
      budget.date = format(values.date, "yyyy-MM-dd");
      success = await AddBudgets(values as unknown as Budget[]);
    } else {
      success = await EditBudget(values as unknown as Budget);
    }

    formToast({
      success,
      form,
      refresh,
      setIsSuccess,
      setIsError,
      editValues,
      fieldsToReset: ["budget", "maxBudget"],
    });
  }

  return (
    <div>
      <Form {...form}>
        <Card className="p-0 md:p-2">
          <CardHeader className="p-2 md:p-6">
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="border-none">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <Field name={"Date"}>
                      <Popover>
                        <PopoverTrigger asChild
                                        className={cn(
                                          form.formState.errors.date && `shake-animation`,
                                        )}
                        >
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <Field name={"Budget"}>
                      <Input
                        inputMode="decimal"
                        type="number"
                        step="any"
                        className={cn(
                          form.formState.errors.budget && `shake-animation`,
                        )}
                        {...field}
                        onChange={(n) => {
                          field.onChange(n.target.valueAsNumber);
                        }}
                      />
                    </Field>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxBudget"
                  render={({ field }) => (
                    <Field name={"Max Budget"}>
                      <Input
                        inputMode="decimal"
                        type="number"
                        step="any"
                        className={cn(
                          form.formState.errors.maxBudget && `shake-animation`,
                        )}
                        {...field}
                        onChange={(n) => {
                          field.onChange(n.target.valueAsNumber);
                        }}
                      />
                    </Field>
                  )}
                />
              </div>
              <CardFormFooter
                isSubmitting={form.formState.isSubmitting}
                isSubmitted={form.formState.isSubmitted}
                isError={isError}
                isSuccess={isSuccess}
              />
            </form>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}