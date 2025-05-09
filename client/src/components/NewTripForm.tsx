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
import {
  CalendarIcon,
  MapPin,
  DollarSign,
  Plus,
  X,
  Rocket,
} from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import CountrySelectDialog from '@/components/CountrySelectDialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import ExpenseDialog from '@/components/ExpenseDialog';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SuggestionDialog from '@/components/SuggestionDialog';
import ct from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

ct.registerLocale(en);

const tripDetailsSchema = z
  .object({
    id: z.string().optional(),
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

/**
 * Trip Form component used for creating new trips and editing existing trips (contrary to its name).
 * It uses react-hook-form for form handling and zod for validation.
 * It also uses a custom CountrySelectDialog component for selecting countries.
 */
export default function NewTripForm({
  isNewTrip = true,
  existingTrip,
  submitting,
  loadedLocation,
  onSubmit,
  deleteExpense,
}: {
  isNewTrip?: boolean;
  existingTrip?: Trip;
  submitting: boolean;
  loadedLocation: string;
  onSubmit: (
    trip: Omit<Trip, 'expenses' | 'id'> & {
      expenses: (Omit<Expense, 'id'> & { id?: string })[];
    }
  ) => Promise<void>;
  deleteExpense?: (expenseId: string) => Promise<void>;
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
  const [expIdsToDelete, setExpIdsToDelete] = useState<string[]>([]);

  function handleExpenseSubmit(expense: Omit<Expense, 'id'>) {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  }

  async function handleTripSubmit(values: z.infer<typeof tripDetailsSchema>) {
    if (user) {
      await Promise.all(expIdsToDelete.map((id) => deleteExpense?.(id)));
      onSubmit({ ...values, expenses, userId: user.id })
        .then(() => router.push('/trips'))
        .catch((err) => toast.error(err.message));
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

  const remainingBudget =
    tripDetailsForm.watch('budget') -
    expenses.reduce((acc, exp) => acc + exp.cost, 0);

  // When existing trip is passed in, set the form values to the existing trip values
  useEffect(() => {
    if (existingTrip) {
      tripDetailsForm.reset({
        id: existingTrip.id,
        name: existingTrip.name,
        location: existingTrip.location,
        startDate: existingTrip.startDate,
        endDate: existingTrip.endDate,
        budget: existingTrip.budget,
        completed: existingTrip.completed,
      });
      setExpenses(existingTrip.expenses || []);
    }
  }, [existingTrip, tripDetailsForm]);

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
                {location
                  ? ct.getName(location, 'en')
                  : 'Click to select a location'}
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

        <div className="mt-6 flex justify-between items-center gap-3 flex-wrap">
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

          {tripDetailsForm.watch('budget') > 0 && (
            <SuggestionDialog
              title={`Our curated budget-friendly destinations in ${ct.getName(
                location,
                'en'
              )}!`}
              description="Let AI (courtesy of OpenAI) suggest budget-friendly destinations in your selected country."
              dialogTrigger={
                <Button
                  type="button"
                  variant="ghost"
                  style={{
                    color: 'var(--lada-accent)',
                    fontWeight: 'bold',
                    border: '1px solid var(--lada-accent)',
                  }}
                >
                  <Rocket />
                  AI SUGGESTIONS
                </Button>
              }
              budget={tripDetailsForm.getValues('budget')}
              country={location}
              onSubmit={(expenses) => {
                setExpenses((prev) => [...prev, ...expenses]);
                toast.success('Added suggestions to your trip!');
              }}
            />
          )}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          elevated={false}
                          type="button"
                          onClick={() => {
                            const indToDel = expenses.findIndex(
                              (e) =>
                                e.name === exp.name &&
                                e.type === exp.type &&
                                e.cost === exp.cost
                            );
                            if (indToDel !== -1) {
                              setExpenses((prev) => {
                                const newExpenses = [...prev];
                                newExpenses.splice(indToDel, 1);
                                return newExpenses;
                              });
                            }
                            if (exp.id) {
                              setExpIdsToDelete((prev) => [
                                ...prev,
                                exp.id as string,
                              ]);
                            }
                          }}
                        >
                          <X />
                        </Button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

        <div className="flex justify-between items-end gap-3 flex-wrap">
          <p
            className="font-bold text-lg"
            style={{ color: remainingBudget < 0 ? 'red' : 'black' }}
          >
            ${remainingBudget}
            <span className="font-light text-sm"> remaining</span>
          </p>
          <Button variant="accent" disabled={submitting}>
            {isNewTrip ? 'PLAN TRIP' : 'UPDATE TRIP'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
