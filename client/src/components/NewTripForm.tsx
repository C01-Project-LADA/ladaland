'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CalendarIcon, MapPin, DollarSign, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import CountrySelectDialog from '@/components/CountrySelectDialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import SectionHeading from './SectionHeading';
import { Button } from '@/components/ui/button';
import ExpenseDialog from './ExpenseDialog';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

const tripDetailsSchema = z
  .object({
    name: z.string().nonempty(),
    location: z.string().nonempty({ message: 'Location is required' }),
    startDate: z.date(),
    endDate: z.date(),
    // budget should be a positive integer
    budget: z.coerce.number().int().positive(),
    completed: z.boolean(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: 'Start date must be before end date',
    path: ['startDate'],
  });

export default function NewTripForm({
  submitting,
  loadedLocation,
  onSubmit,
}: {
  submitting: boolean;
  loadedLocation: string;
  onSubmit: (
    trip: Omit<Trip, 'expenses' | 'id'> & {
      expenses: (Omit<Expense, 'id'> & { id?: string })[];
    }
  ) => Promise<void>;
}) {
  const tripDetailsForm = useForm<z.infer<typeof tripDetailsSchema>>({
    resolver: zodResolver(tripDetailsSchema),
    defaultValues: {
      name: '',
      location: loadedLocation,
      budget: 0,
      completed: false,
    },
  });

  const router = useRouter();
  const { user } = useUser();

  const [expenses, setExpenses] = useState<
    (Omit<Expense, 'id'> & { id?: string })[]
  >([]);

  function handleExpenseSubmit(expense: Omit<Expense, 'id'>) {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  }

  async function handleTripSubmit(values: z.infer<typeof tripDetailsSchema>) {
    if (user) {
      console.log(values);
      onSubmit({ ...values, expenses, userId: user.id }).then(() =>
        router.push('/trips')
      );
    }
  }

  const [countriesSelected, setCountriesSelected] = useState<
    Record<string, Country>
  >({});

  const location = tripDetailsForm.getValues().location;

  // When countries selected changes, extract the country selected and revert it back to an empty object
  useEffect(() => {
    if (Object.keys(countriesSelected).length > 0) {
      const country = Object.values(countriesSelected)[0];
      setCountriesSelected({});
      tripDetailsForm.setValue('location', country.code);
    }
  }, [countriesSelected, tripDetailsForm]);

  return (
    <Form {...tripDetailsForm}>
      <form
        className="mt-6 mb-16"
        onSubmit={tripDetailsForm.handleSubmit(handleTripSubmit)}
      >
        <FormField
          control={tripDetailsForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trip Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Give your planned trip a name!"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-3" />

        <p className="text-sm">Location</p>
        <CountrySelectDialog
          title="Plan a new trip to..."
          description="Select a country to plan a new trip to."
          countriesSelected={{}}
          setCountriesSelected={setCountriesSelected}
          dialogTrigger={
            <button className="flex flex-col items-start w-full mt-2">
              <div className="px-3 py-2 border border-input rounded-md w-full text-left flex justify-between items-center">
                {location ? location : 'Click to select a location'}
                <MapPin />
              </div>
            </button>
          }
        />

        <FormField
          control={tripDetailsForm.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="hidden">Location</FormLabel>
              <FormControl>
                <Input
                  className="hidden"
                  placeholder="Where are you planning to go?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4" />

        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex-1 min-w-[150px]">
            <FormField
              control={tripDetailsForm.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <button className="rounded-md border border-input flex justify-between items-center py-2 px-3">
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <FormField
              control={tripDetailsForm.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <button className="rounded-md border border-input flex justify-between items-center py-2 px-3">
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-8" />
        <SectionHeading title="Budget" />
        <div className="mt-2" />
        <FormField
          control={tripDetailsForm.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  startIcon={DollarSign}
                  placeholder="How much are you planning to spend?"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the total amount you are planning to spend on this trip.
                <br />
                LADA Land will help you keep track of your expenses and let you
                know if you are over or under budget.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-6">
          <ExpenseDialog
            title="Add an expense"
            description="Add an expense to your trip. This could be anything from a flight to a meal to a hotel stay."
            dialogTrigger={
              <Button type="button">
                <Plus />
                ADD AN EXPENSE
              </Button>
            }
            onSubmit={handleExpenseSubmit}
          />
        </div>

        <div className="mt-8" />

        {[
          'flight',
          'transportation',
          'accommodation',
          'meals',
          'events',
          'other',
        ]
          .filter((type) => expenses.some((exp) => exp.type === type))
          .map((type) => (
            <div key={type} className="mb-8">
              <SectionHeading
                title={type.charAt(0).toUpperCase() + type.slice(1)}
              />
              <div className="mt-3" />
              <ul className="list-inside list-disc">
                {expenses
                  .filter((exp) => exp.type === type)
                  .map((exp, index) => (
                    <li
                      key={exp.type + index}
                      className="flex items-center justify-between px-3 py-1 border-2 border-input rounded-md mt-2"
                    >
                      <p>{exp.name}</p>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-md">
                          $ <span className="text-sm">{exp.cost}</span>
                        </p>
                        <Button variant="ghost" size="icon" elevated={false}>
                          <X />
                        </Button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

        <div className="flex justify-end items-center gap-3">
          <Button variant="accent" disabled={submitting}>
            PLAN TRIP
          </Button>
        </div>
      </form>
    </Form>
  );
}
