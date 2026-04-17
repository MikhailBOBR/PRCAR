"use client";

import { useDeferredValue, useMemo, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Filter, RotateCcw } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import {
  bodyTypeOptions,
  driveTypeOptions,
  fuelTypeOptions,
  sortOptions,
  transmissionOptions,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";

type CatalogFilterValues = {
  query: string;
  brand: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  driveType: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  maxMileage: string;
  sort: string;
};

export function CatalogFilters({
  brands,
  initialValues,
}: {
  brands: string[];
  initialValues: CatalogFilterValues;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset, control } = useForm<CatalogFilterValues>({
    defaultValues: initialValues,
  });

  const watchedQuery = useWatch({
    control,
    name: "query",
  });
  const deferredQuery = useDeferredValue(watchedQuery);
  const helperLabel = useMemo(() => {
    if (!deferredQuery) {
      return "Поиск по марке, модели, описанию и городу.";
    }

    return `Будет найдено по запросу: ${deferredQuery}`;
  }, [deferredQuery]);

  function updateUrl(values: CatalogFilterValues) {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(values)) {
      if (value) {
        searchParams.set(key, value);
      }
    }

    const nextUrl = searchParams.toString() ? `${pathname}?${searchParams}` : pathname;
    router.replace(nextUrl);
  }

  return (
    <form
      className="glass space-y-5 rounded-[1.75rem] p-5"
      onSubmit={handleSubmit((values) =>
        startTransition(() => {
          updateUrl(values);
        }),
      )}
    >
      <div className="flex items-center gap-2">
        <Filter className="size-4 text-brand" />
        <h2 className="font-display text-2xl text-navy">Фильтры</h2>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-navy" htmlFor="query">
          Поиск
        </label>
        <input
          id="query"
          {...register("query")}
          className="w-full rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-brand/40"
          placeholder="Toyota, AWD, Москва..."
        />
        <p className="text-xs text-muted">{helperLabel}</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-navy">Марка</label>
        <select
          {...register("brand")}
          className="w-full rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-brand/40"
        >
          <option value="">Все марки</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FilterSelect label="Кузов" field={register("bodyType")} options={bodyTypeOptions} />
        <FilterSelect label="Топливо" field={register("fuelType")} options={fuelTypeOptions} />
        <FilterSelect
          label="Коробка"
          field={register("transmission")}
          options={transmissionOptions}
        />
        <FilterSelect label="Привод" field={register("driveType")} options={driveTypeOptions} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Цена от" field={register("minPrice")} />
        <NumberField label="Цена до" field={register("maxPrice")} />
        <NumberField label="Год от" field={register("minYear")} />
        <NumberField label="Год до" field={register("maxYear")} />
        <NumberField label="Пробег до" field={register("maxMileage")} />
        <FilterSelect label="Сортировка" field={register("sort")} options={sortOptions} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button className="w-full sm:w-auto" disabled={isPending} type="submit">
          Применить
        </Button>
        <Button
          className="w-full sm:w-auto"
          disabled={isPending}
          type="button"
          variant="secondary"
          onClick={() => {
            const defaults: CatalogFilterValues = {
              query: "",
              brand: "",
              bodyType: "",
              fuelType: "",
              transmission: "",
              driveType: "",
              minPrice: "",
              maxPrice: "",
              minYear: "",
              maxYear: "",
              maxMileage: "",
              sort: "featured",
            };
            reset(defaults);
            startTransition(() => updateUrl(defaults));
          }}
        >
          <RotateCcw className="size-4" />
          Сбросить
        </Button>
      </div>
    </form>
  );
}

function FilterSelect({
  label,
  field,
  options,
}: {
  label: string;
  field: ReturnType<typeof useForm<CatalogFilterValues>>["register"] extends (
    ...args: never[]
  ) => infer T
    ? T
    : never;
  options: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-navy">{label}</label>
      <select
        {...field}
        className="w-full rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-brand/40"
      >
        <option value="">Любой вариант</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberField({
  label,
  field,
}: {
  label: string;
  field: ReturnType<typeof useForm<CatalogFilterValues>>["register"] extends (
    ...args: never[]
  ) => infer T
    ? T
    : never;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-navy">{label}</label>
      <input
        {...field}
        type="number"
        className="w-full rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-brand/40"
      />
    </div>
  );
}
