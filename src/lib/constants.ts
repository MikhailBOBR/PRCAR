import {
  BodyType,
  CarStatus,
  DriveType,
  FuelType,
  OrderStatus,
  OrderType,
  Transmission,
  UserRole,
} from "@prisma/client";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const bodyTypeLabels: Record<BodyType, string> = {
  SEDAN: "Седан",
  SUV: "SUV",
  HATCHBACK: "Хэтчбек",
  COUPE: "Купе",
  PICKUP: "Пикап",
  CROSSOVER: "Кроссовер",
  WAGON: "Универсал",
};

export const fuelTypeLabels: Record<FuelType, string> = {
  PETROL: "Бензин",
  DIESEL: "Дизель",
  HYBRID: "Гибрид",
  ELECTRIC: "Электро",
};

export const transmissionLabels: Record<Transmission, string> = {
  AUTOMATIC: "Автомат",
  MANUAL: "Механика",
  ROBOT: "Робот",
  CVT: "Вариатор",
};

export const driveTypeLabels: Record<DriveType, string> = {
  FWD: "Передний",
  RWD: "Задний",
  AWD: "Полный",
};

export const carStatusLabels: Record<CarStatus, string> = {
  AVAILABLE: "В наличии",
  RESERVED: "Зарезервирован",
  SOLD: "Продан",
  ARCHIVED: "Архив",
};

export const orderTypeLabels: Record<OrderType, string> = {
  PURCHASE: "Покупка",
  RESERVATION: "Бронь",
  TEST_DRIVE: "Тест-драйв",
  CREDIT: "Кредит / лизинг",
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В обработке",
  APPROVED: "Одобрена",
  COMPLETED: "Завершена",
  CANCELLED: "Отменена",
};

export const userRoleLabels: Record<UserRole, string> = {
  CLIENT: "Клиент",
  MANAGER: "Менеджер",
  ADMIN: "Администратор",
};

export const bodyTypeOptions = Object.entries(bodyTypeLabels).map(([value, label]) => ({
  value: value as BodyType,
  label,
}));

export const fuelTypeOptions = Object.entries(fuelTypeLabels).map(([value, label]) => ({
  value: value as FuelType,
  label,
}));

export const transmissionOptions = Object.entries(transmissionLabels).map(([value, label]) => ({
  value: value as Transmission,
  label,
}));

export const driveTypeOptions = Object.entries(driveTypeLabels).map(([value, label]) => ({
  value: value as DriveType,
  label,
}));

export const carStatusOptions = Object.entries(carStatusLabels).map(([value, label]) => ({
  value: value as CarStatus,
  label,
}));

export const orderTypeOptions = Object.entries(orderTypeLabels).map(([value, label]) => ({
  value: value as OrderType,
  label,
}));

export const orderStatusOptions = Object.entries(orderStatusLabels).map(([value, label]) => ({
  value: value as OrderStatus,
  label,
}));

export const userRoleOptions = Object.entries(userRoleLabels).map(([value, label]) => ({
  value: value as UserRole,
  label,
}));

export const sortOptions = [
  { value: "featured", label: "Сначала рекомендованные" },
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "price-desc", label: "Цена: по убыванию" },
  { value: "year-desc", label: "Год: новые сверху" },
  { value: "year-asc", label: "Год: старые сверху" },
  { value: "mileage-asc", label: "Пробег: меньше сначала" },
] as const;

export type SortOption = (typeof sortOptions)[number]["value"];
