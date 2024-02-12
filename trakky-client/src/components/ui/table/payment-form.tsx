"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  Field
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Selection } from "@/components/ui/select.tsx";
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
import { CalendarIcon, Minus, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import { useEffect, useReducer, useState } from "react";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  AddPayments,
  EditPayment,
  DeletePayments,
  Payment,
} from "@/infrastructure/payment.tsx";
import { getOwners } from "@/infrastructure/owner.tsx";
import { getTypes } from "@/infrastructure/transaction-type.tsx";
import { resultToast } from "@/components/ui/use-toast.ts";
import { Toggle } from "@/components/ui/toggle.tsx";
import Spinner from "@/components/ui/spinner.tsx";
import {
  FetchActionType,
  paymentFormDataReducer,
  FETCH_INITIAL_STATE,
} from "@/components/ui/table/payment-form-reducer.ts";
import { ErrorMessage } from "@/infrastructure/base-api.ts";
import { errorMessage } from "@/components/ui/table/form-error-message.ts";

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
const formSchema = z.object({
  id: z.number().optional(),
  owner: z.string(),
  type: z.string(),
  date: z.date(),
  amount: z.number().refine((val) => val !== 0, {
    message: "cannot be 0",
  }),
  description: z.string().refine((val) => val.length <= 50 && val.length > 0),
});

export function PaymentForm({
  title,
  refresh,
  editValues,
}: {
  title: string;
  refresh: (signal?: AbortSignal, flushPaymentsBeforeRefresh?: boolean) => void;
  editValues?: Payment;
}) {
  const [amountIsNegative, setAmountIsNegative] = useState(editValues ? editValues.amount < 0 : false);
  const [fetchState, dispatchFetch] = useReducer(paymentFormDataReducer, FETCH_INITIAL_STATE);
  const [isError, setIsError] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: editValues?.id === undefined ? undefined : Number(editValues?.id),
      date:
        editValues?.date === undefined
          ? new Date()
          : new Date(editValues?.date),
      owner: editValues?.owner ?? "",
      type: editValues?.type ?? "",
      amount: editValues?.amount ?? 0,
      description: editValues?.description ?? "",
    },
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const formData = async () => {
      dispatchFetch({ type: FetchActionType.FETCH_START });

      const { data: ownersData, error: ownersError } = await getOwners(signal);

      if(ownersError) {
        dispatchFetch({ type: FetchActionType.FETCH_ERROR, payload: ownersError.error });
        return;
      }
      const fetchedOwners = ownersData.map((owner) => owner.name);
      fetchedOwners.push("Shared");

      dispatchFetch({ type: FetchActionType.FETCHED_OWNERS, payload: fetchedOwners});

      const { data: typesData, error: typesError } = await getTypes(signal);
      if(typesError) {
        dispatchFetch({ type: FetchActionType.FETCH_ERROR, payload: typesError.error });
        return;
      }

      const fetchedTypes = typesData.map((type) => type.name);

      dispatchFetch({ type: FetchActionType.FETCHED_TYPES, payload: fetchedTypes});

      if(editValues === undefined) {
        form.setValue("owner", fetchedOwners[0]);
        form.setValue("type", fetchedTypes[0]);
      }
    }

      formData().then(() => {
        dispatchFetch({ type: FetchActionType.FETCH_END });
      }).catch((e) => {
        console.error(e);
        dispatchFetch({ type: FetchActionType.FETCH_ERROR, payload: ErrorMessage.INTERNAL_SERVER_ERROR });
      });
  }, []);

  function onAmountChange(amount: number) {
    if (amount < 0) {
      setAmountIsNegative(true);
    } else {
      setAmountIsNegative(false);
    }

    form.setValue("amount", amount);
  }

  const splitPayments = (payment: Payment) => {
    return fetchState.owners
      .filter((owner: string) => owner !== "Shared")
      .map((owner: string) => ({
        amount: payment.amount / (fetchState.owners.length - 1),
        type: payment.type,
        owner: owner,
        description: payment.description,
        date: payment.date
      } as Payment));
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsError(false);
    const payment = values as unknown as Payment;

    if (amountIsNegative) {
      payment.amount = -Math.abs(form.getValues("amount"))
    } else {
      payment.amount = Math.abs(form.getValues("amount"))
    }

    let payments: Payment[];
    const isNewPayment = editValues === undefined;

    if (payment.owner === "Shared") {
      payments = splitPayments(payment);
      if(!isNewPayment) {
        const { data, error } = await DeletePayments([Number(payment.id)]);
        if(error || !data) {
          return errorMessage(setIsError, error?.error);
        }
      }
    } else {
      payments = [payment];
    }

    if(isNewPayment || payment.owner === "Shared") {
      const { data, error } = await AddPayments(payments);
      if(error || !data) {
        return errorMessage(setIsError,error?.error);
      }
    } else {
      const { data, error } = await EditPayment(payment);
      if(error || !data) {
        return errorMessage(setIsError, error?.error);
      }
    }

    resultToast({
      isError: false,
      message: "Transaction saved",
    });

    setTimeout(() => {
      form.reset();
      form.clearErrors();
      refresh(undefined, true);
    }, 1000);
  }

  return (
    <div>
      <Form {...form}>
        <Card className="p-0 md:p-2">
          {
            fetchState.error !== null ? (<div className="my-12 text-center text-red-500">{fetchState.error}</div>)
              : fetchState.loading ? (<Spinner className="flex flex-row justify-center align-middle my-12" />)
          : (<>
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
                            <PopoverTrigger asChild >
                              <Button
                                disabled={form.formState.isSubmitting || form.formState.isSubmitted}
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
                  <div>
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <Field name={"Amount"}>
                          <div className="flex flex-row">
                            <Toggle
                              disabled={form.formState.isSubmitting || form.formState.isSubmitted}
                              aria-label="Toggle italic"
                              className={cn(
                                form.formState.errors.amount && `shake-animation`,
                                "rounded-l mr-0 rounded-r-none h-9 border px-3 data-[state=on]:bg-red-500 data-[state=off]:bg-green-500 data-[state=on]:text-white data-[state=off]:text-white"
                              )}
                              onClick={() => setAmountIsNegative(!amountIsNegative)}
                              pressed={amountIsNegative}
                            >
                              {amountIsNegative ? (<Minus className="h-4 w-2.5" />) : (<Plus className="h-4 w-2.5" />)}
                            </Toggle>
                            <Input
                              disabled={form.formState.isSubmitting || form.formState.isSubmitted}
                              inputMode="decimal"
                              type="number"
                              step="any"
                              className={cn(
                                form.formState.errors.amount && `shake-animation`,
                                "rounded-l-none h-9 ml-0"
                              )}
                              {...field}
                              onChange={(n) => {
                                onAmountChange(n.target.valueAsNumber);
                              }}
                            />
                          </div>
                        </Field>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="owner"
                      render={({ field }) => (
                        <Field name={"Owner"}>
                          <Selection
                            value={field.value}
                            onChange={field.onChange}
                            options={fetchState.owners}
                            {...{
                              disabled: form.formState.isSubmitting || form.formState.isSubmitted,
                              className:
                                "rounded-md w-full overscroll-contain mb-4",
                            }}
                          />
                        </Field>
                      )}
                    />
                    <FormField
                      name="type"
                      render={({ field }) => (
                        <Field name={"Type"}>
                          <Selection
                            value={field.value}
                            onChange={field.onChange}
                            options={fetchState.types}
                            {...{
                              disabled: form.formState.isSubmitting || form.formState.isSubmitted,
                              className:
                                "rounded-md w-full overscroll-contain mb-4",
                            }}
                          />
                        </Field>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      name="description"
                      render={({ field }) => (
                        <Field name={"Description"}>
                          <Textarea
                            disabled={form.formState.isSubmitting || form.formState.isSubmitted}
                            onChange={field.onChange}
                            value={field.value}
                            className={cn(
                              "pb-0 mb-0",
                              form.formState.errors.description &&
                              `shake-animation`,
                            )}
                          ></Textarea>
                        </Field>
                      )}
                    />
                  </div>
                  <CardFormFooter
                    isSubmitting={form.formState.isSubmitting}
                    isSubmittedSuccessfully={form.formState.isSubmitSuccessful}
                    submitted={form.formState.isSubmitted}
                    isError={isError}
                  />
                </form>
              </CardContent>
            </>)
          }
        </Card>
      </Form>
    </div>
  );
}
