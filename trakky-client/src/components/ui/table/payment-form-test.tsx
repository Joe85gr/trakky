'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, Field } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFormFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { twMerge } from 'tailwind-merge';
import { useEffect, useReducer, useState } from 'react';
import { Client } from '@/infrastructure/client-injector';
import { resultToast } from '@/components/ui/use-toast';
import {
  FetchActionType,
  paymentFormDataReducer,
  FETCH_INITIAL_STATE,
} from '@/components/ui/table/payment-form-reducer';
import { ErrorMessage } from '@/infrastructure/remote/base';
import { errorMessage } from '@/components/ui/table/form-error-message';
import {
  Category,
  Owner,
  Payment,
  PaymentToShare,
  SharedExpenses,
} from '@/models/dtos';
import PaymentsRecap from '@/components/payments/payments-recap';
import { Endpoint } from '@/constants';
import Loading from '../loading';
import { Dictionary } from './icons';
import {
  CalendarField,
  NumericField,
  SelectionField,
  SwitchField,
  TextInputField,
} from './form-fields';

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    return { message: '' };
  }
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: '' };
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
    message: 'cannot be 0',
  }),
  description: z.string().refine((val) => val.length <= 50 && val.length > 0),
  toShare: z.boolean().optional(),
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
  const [addedPayments, setAddedPayments] = useState<Payment[]>([]);
  const [amountIsNegative, setAmountIsNegative] = useState(
    editValues ? editValues.amount < 0 : false
  );
  const [shareSwitchIsHidden, setShareSwitchIsHidden] =
    useState<boolean>(false);
  const [showUserButtons, setShowUserButtons] = useState<boolean>(false);
  const [fetchState, dispatchFetch] = useReducer(
    paymentFormDataReducer,
    FETCH_INITIAL_STATE
  );
  const [isError, setIsError] = useState(false);
  const [checkBoxStates, setCheckboxStates] = useState<Dictionary<boolean>>({});
  const [owners, setOwners] = useState<Owner[]>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: editValues?.id === undefined ? undefined : Number(editValues?.id),
      date:
        editValues?.date === undefined ? undefined : new Date(editValues?.date),
      owner: editValues?.owner,
      type: editValues?.type,
      amount: editValues?.amount ?? 0,
      description: editValues?.description ?? '',
    },
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const formData = async () => {
      dispatchFetch({ type: FetchActionType.FETCH_START });

      const { data, error: ownersError } = await Client.Get(
        Endpoint.Owners,
        signal
      );

      if (ownersError) {
        dispatchFetch({
          type: FetchActionType.FETCH_ERROR,
          payload: ownersError.error,
        });
        return;
      }
      const ownersData = data as Owner[];
      setOwners(ownersData);
      const fetchedOwners = ownersData.map((owner) => owner.name);
      fetchedOwners.push('Shared');

      dispatchFetch({
        type: FetchActionType.FETCHED_OWNERS,
        payload: fetchedOwners,
      });

      const { data: catData, error: categoriesError } = await Client.Get(
        Endpoint.Categories,
        signal
      );
      if (categoriesError) {
        dispatchFetch({
          type: FetchActionType.FETCH_ERROR,
          payload: categoriesError.error,
        });
        return;
      }

      const categoriesData = catData as Category[];
      const fetchedCategories = categoriesData.map((type) => type.name);

      dispatchFetch({
        type: FetchActionType.FETCHED_CATEGORIES,
        payload: fetchedCategories,
      });

      const { data: sharedExpenses, error: sharedExpensesError } =
        await Client.Get(Endpoint.SharedExpenses, signal);
      if (sharedExpensesError) {
        dispatchFetch({
          type: FetchActionType.FETCH_ERROR,
          payload: sharedExpensesError.error,
        });
      }

      const sharedExpensesData = sharedExpenses as SharedExpenses[];

      dispatchFetch({
        type: FetchActionType.FETCHED_SHARED_EXPENSES,
        payload: sharedExpensesData,
      });
    };

    formData()
      .then(() => {
        dispatchFetch({ type: FetchActionType.FETCH_END });
      })
      .catch(() => {
        dispatchFetch({
          type: FetchActionType.FETCH_ERROR,
          payload: ErrorMessage.INTERNAL_SERVER_ERROR,
        });
      });
  }, [editValues, form]);

  useEffect(() => {
    form.setValue('type', editValues?.type ?? fetchState.categories[0]);
    form.setValue('owner', editValues?.owner ?? fetchState.owners[0]);
    // eslint-disable-next-line
  }, [fetchState.categories, fetchState.owners]);

  const splitPayments = (payment: Payment) => {
    return fetchState.owners
      .filter((owner: string) => owner !== 'Shared')
      .map(
        (owner: string) =>
          ({
            amount: payment.amount / (fetchState.owners.length - 1),
            type: payment.type,
            owner,
            description: payment.description,
            date: payment.date,
          }) as Payment
      );
  };

  function allCheckboxesAreOn(
    dictionary: Dictionary<boolean>,
    newState: boolean
  ) {
    return (
      newState === true && Object.values(dictionary).every((e) => e === true)
    );
  }

  async function setAllCheckBoxes(newState: boolean) {
    const users: Dictionary<boolean> = {};

    Object.keys(checkBoxStates).forEach((user) => {
      users[user] = newState;
    });

    setCheckboxStates(users);
  }

  async function setCheckBox(key: string, state?: boolean) {
    const users: Dictionary<boolean> = { All: false };

    owners?.forEach((user) => {
      users[user.name] = checkBoxStates[user.name];
    });

    const newState = state ?? !users[key];

    users[key] = newState;

    const usersState: Dictionary<boolean> = {};

    Object.keys(users).forEach((user) => {
      if (user !== 'All') {
        usersState[user] = users[user];
      }
    });

    if (allCheckboxesAreOn(usersState, newState)) {
      users.All = true;
    } else {
      users.All = false;
    }

    setCheckboxStates(users);
  }

  const checkboxStyle = (isChecked: boolean) =>
    twMerge(
      'text-base font-normal h-9 transition-colors duration-300',
      isChecked
        ? 'bg-button-checkbox hover:bg-button-checkbox text-primary hover:text-primary hover:font-bold'
        : 'bg-background hover:bg-background text-muted-foreground/50 hover:text-muted-foreground'
    );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsError(false);

    const paymentToShare = values as unknown as PaymentToShare;

    const payment: Payment = {
      owner: paymentToShare.owner,
      date: paymentToShare.date,
      description: paymentToShare.description,
      amount: paymentToShare.amount,
      type: paymentToShare.type,
    };

    if (amountIsNegative) {
      payment.amount = -Math.abs(form.getValues('amount'));
    } else {
      payment.amount = Math.abs(form.getValues('amount'));
    }

    let payments: Payment[];
    const isNewPayment = editValues === null;

    if (payment.owner === 'Shared') {
      payments = splitPayments(payment);
      if (!isNewPayment) {
        const { data, error } = await Client.Delete(Endpoint.Payments, [
          Number(payment.id),
        ]);
        if (error || !data) {
          errorMessage(setIsError, error?.error);
          return;
        }
      }
    } else {
      payments = [payment];
    }

    const saveSharedExpenses = async (data: string | number) => {
      const shared: SharedExpenses[] = [];

      console.log('checkBoxStates', checkBoxStates);

      Object.keys(checkBoxStates).forEach((user) => {
        if (user !== 'All' && checkBoxStates[user] === true) {
          const paymentId = payment.id ?? data;
          const ownerId = owners?.filter((owner) => owner.name === user)[0].id;
          shared.push({
            PaymentId: Number(paymentId),
            OwnerId: Number(ownerId),
            Complete: false,
          });
        }
      });

      await Client.Post(Endpoint.SharedExpenses, shared);
    };

    if (isNewPayment || payment.owner === 'Shared') {
      const { data, error } = await Client.Post(Endpoint.Payments, payments);
      console.log('data', data);
      if (error || !data) {
        errorMessage(setIsError, error?.error);
        return;
      }

      await saveSharedExpenses(data);
    } else {
      const { data, error } = await Client.Put(Endpoint.Payments, payment);
      if (error || !data) {
        errorMessage(setIsError, error?.error);
        return;
      }

      await saveSharedExpenses(data);
    }
    setAddedPayments(addedPayments.concat(payments));

    resultToast({
      isError: false,
      message: 'Transaction saved',
    });

    setTimeout(() => {
      form.reset();
      form.setValue('owner', payment.owner);
      form.setValue('type', payment.type);
      form.setValue('date', new Date(payment.date));
      refresh(undefined, false);
    }, 1000);
  }

  const cardContent = () => {
    if (fetchState.error !== null) {
      return (
        <div className="my-12 text-center text-red-500">{fetchState.error}</div>
      );
    }

    return (
      <>
        <CardHeader className="p-2 md:p-6">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="border-none">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1">
              <CalendarField form={form} name="date" title="Date" />
            </div>
            <div className="flex flex-row">
              <div
                className={twMerge(
                  shareSwitchIsHidden && 'w-[100%]',
                  !shareSwitchIsHidden && 'w-[70%]',
                  'justify-center transition-all duration-200 ease-out'
                )}
              >
                <NumericField
                  form={form}
                  name="amount"
                  title="Amount"
                  setAmountIsNegative={setAmountIsNegative}
                  amountIsNegative={amountIsNegative}
                />
              </div>
              <div
                className={twMerge(
                  shareSwitchIsHidden && 'hidden',
                  'w-[30%] justify-center'
                )}
              >
                <SwitchField
                  form={form}
                  name="toShare"
                  title="To Share"
                  onChange={(e) => {
                    setShowUserButtons(e === true);
                    setAllCheckBoxes(false);
                  }}
                />
              </div>
            </div>
            {showUserButtons && (
              <FormField
                control={form.control}
                name="toShare"
                render={({ field }) => (
                  <Field name="Share between">
                    <div className="flex flex-row flex-wrap align-middle gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className={checkboxStyle(checkBoxStates.All)}
                        onClick={() => {
                          setAllCheckBoxes(!checkBoxStates.All);
                        }}
                      >
                        All
                      </Button>
                      {fetchState.owners
                        .filter((owner: string) => owner !== 'Shared')
                        .map((owner: string) => {
                          return (
                            <Button
                              type="button"
                              key={owner}
                              variant="outline"
                              className={checkboxStyle(checkBoxStates[owner])}
                              onClick={() => {
                                setCheckBox(owner);
                              }}
                            >
                              {owner}
                            </Button>
                          );
                        })}
                    </div>
                  </Field>
                )}
              />
            )}
            <div className="grid grid-cols-2 gap-2">
              <SelectionField
                name="owner"
                title="Owner"
                form={form}
                options={fetchState.owners}
                onChange={(e) => {
                  const isShared = e === 'Shared';
                  setShareSwitchIsHidden(isShared);
                  if (isShared) {
                    setShowUserButtons(false);
                    form.setValue('toShare', false);
                  }
                }}
              />
              <SelectionField
                name="type"
                title="Type"
                form={form}
                options={fetchState.categories}
              />
            </div>
            <div>
              <TextInputField
                form={form}
                name="description"
                title="Description"
              />
            </div>
            <CardFormFooter
              isSubmitting={form.formState.isSubmitting}
              isSubmittedSuccessfully={form.formState.isSubmitSuccessful}
              submitted={form.formState.isSubmitted}
              isError={isError}
            />
            {addedPayments.length > 0 && !editValues && (
              <div className="flex flex-col justify-center align-middle text-muted-foreground">
                <div className="text-center text-sm font-medium mb-1">
                  Added entries:
                </div>
                <div className="text-sm overflow-y-scroll">
                  <PaymentsRecap entries={addedPayments} limitedSpace />
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </>
    );
  };

  return (
    <Form {...form}>
      <Card className="p-0 md:p-2">
        <Loading loading={fetchState.loading}>{cardContent()}</Loading>
      </Card>
    </Form>
  );
}

PaymentForm.defaultProps = {
  editValues: null,
};

export default PaymentForm;
