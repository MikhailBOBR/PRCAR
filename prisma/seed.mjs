import {
  BodyType,
  CarStatus,
  DriveType,
  FuelType,
  OrderStatus,
  OrderType,
  PrismaClient,
  Transmission,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const carFixtures = [
  {
    brand: "Toyota",
    model: "Camry",
    year: 2022,
    price: 3150000,
    mileage: 28000,
    vin: "JTNB11HK8N3031451",
    color: "Pearl White",
    city: "Москва",
    engineVolume: 2.5,
    horsepower: 200,
    bodyType: BodyType.SEDAN,
    fuelType: FuelType.HYBRID,
    transmission: Transmission.CVT,
    driveType: DriveType.FWD,
    featured: true,
    status: CarStatus.AVAILABLE,
    description:
      "Комфортный седан с отличной шумоизоляцией, адаптивным круиз-контролем и прозрачной сервисной историей.",
    images: ["/images/demo/lumen-sedan.svg", "/images/demo/ember-sedan.svg"],
  },
  {
    brand: "BMW",
    model: "X3",
    year: 2021,
    price: 4650000,
    mileage: 39000,
    vin: "WBX57DP05M9D24518",
    color: "Graphite",
    city: "Москва",
    engineVolume: 2.0,
    horsepower: 249,
    bodyType: BodyType.SUV,
    fuelType: FuelType.PETROL,
    transmission: Transmission.AUTOMATIC,
    driveType: DriveType.AWD,
    featured: true,
    status: CarStatus.AVAILABLE,
    description:
      "Драйверский кроссовер с полным приводом, панорамной крышей и аккуратным состоянием салона.",
    images: ["/images/demo/atlas-suv.svg", "/images/demo/noir-suv.svg"],
  },
  {
    brand: "Audi",
    model: "A6",
    year: 2020,
    price: 3850000,
    mileage: 51000,
    vin: "WAUZZZF25LN102814",
    color: "Mythos Black",
    city: "Санкт-Петербург",
    engineVolume: 2.0,
    horsepower: 245,
    bodyType: BodyType.SEDAN,
    fuelType: FuelType.PETROL,
    transmission: Transmission.ROBOT,
    driveType: DriveType.AWD,
    featured: true,
    status: CarStatus.AVAILABLE,
    description:
      "Бизнес-седан с виртуальной приборной панелью, матричной оптикой и комфортом для дальних поездок.",
    images: ["/images/demo/ember-sedan.svg", "/images/demo/lumen-sedan.svg"],
  },
  {
    brand: "Kia",
    model: "Sportage",
    year: 2023,
    price: 2990000,
    mileage: 12000,
    vin: "KNAPU81CSP7235012",
    color: "Urban Olive",
    city: "Казань",
    engineVolume: 2.0,
    horsepower: 150,
    bodyType: BodyType.CROSSOVER,
    fuelType: FuelType.PETROL,
    transmission: Transmission.AUTOMATIC,
    driveType: DriveType.AWD,
    featured: true,
    status: CarStatus.AVAILABLE,
    description:
      "Современный городской кроссовер с камерами кругового обзора, CarPlay и зимним пакетом.",
    images: ["/images/demo/atlas-suv.svg", "/images/demo/skyline-crossover.svg"],
  },
  {
    brand: "Mercedes-Benz",
    model: "E 200",
    year: 2019,
    price: 3790000,
    mileage: 63000,
    vin: "WDD2130421A441357",
    color: "Silver",
    city: "Москва",
    engineVolume: 2.0,
    horsepower: 197,
    bodyType: BodyType.SEDAN,
    fuelType: FuelType.PETROL,
    transmission: Transmission.AUTOMATIC,
    driveType: DriveType.RWD,
    featured: false,
    status: CarStatus.AVAILABLE,
    description:
      "Статусный седан с отделкой натуральным деревом, системой удержания полосы и мягкой подвеской.",
    images: ["/images/demo/lumen-sedan.svg", "/images/demo/noir-suv.svg"],
  },
  {
    brand: "Volkswagen",
    model: "Tiguan",
    year: 2021,
    price: 2840000,
    mileage: 47000,
    vin: "WVGZZZ5NZMW271654",
    color: "Deep Blue",
    city: "Екатеринбург",
    engineVolume: 2.0,
    horsepower: 180,
    bodyType: BodyType.SUV,
    fuelType: FuelType.PETROL,
    transmission: Transmission.ROBOT,
    driveType: DriveType.AWD,
    featured: false,
    status: CarStatus.AVAILABLE,
    description:
      "Сбалансированный семейный кроссовер с просторным багажником и уверенным полным приводом.",
    images: ["/images/demo/atlas-suv.svg", "/images/demo/noir-suv.svg"],
  },
  {
    brand: "Hyundai",
    model: "Elantra",
    year: 2022,
    price: 2140000,
    mileage: 23000,
    vin: "KMHLN41DBNU181126",
    color: "Phantom Black",
    city: "Новосибирск",
    engineVolume: 1.6,
    horsepower: 128,
    bodyType: BodyType.SEDAN,
    fuelType: FuelType.PETROL,
    transmission: Transmission.AUTOMATIC,
    driveType: DriveType.FWD,
    featured: false,
    status: CarStatus.AVAILABLE,
    description:
      "Экономичный седан с аккуратным пробегом, подогревом сидений и камерой заднего вида.",
    images: ["/images/demo/ember-sedan.svg", "/images/demo/lumen-sedan.svg"],
  },
  {
    brand: "Skoda",
    model: "Octavia",
    year: 2020,
    price: 2280000,
    mileage: 56000,
    vin: "TMBJR7NX8LY092451",
    color: "Steel Grey",
    city: "Нижний Новгород",
    engineVolume: 1.4,
    horsepower: 150,
    bodyType: BodyType.WAGON,
    fuelType: FuelType.PETROL,
    transmission: Transmission.AUTOMATIC,
    driveType: DriveType.FWD,
    featured: false,
    status: CarStatus.AVAILABLE,
    description:
      "Практичный лифтбек с большим багажником, камерой заднего вида и низким расходом топлива.",
    images: ["/images/demo/ember-sedan.svg", "/images/demo/skyline-crossover.svg"],
  },
  {
    brand: "Lexus",
    model: "RX 350",
    year: 2021,
    price: 5490000,
    mileage: 33000,
    vin: "2T2BZMCA5MC312441",
    color: "Sonic Quartz",
    city: "Москва",
    engineVolume: 3.5,
    horsepower: 300,
    bodyType: BodyType.SUV,
    fuelType: FuelType.PETROL,
    transmission: Transmission.AUTOMATIC,
    driveType: DriveType.AWD,
    featured: true,
    status: CarStatus.AVAILABLE,
    description:
      "Премиальный кроссовер с трехзонным климатом, адаптивной подвеской и богатой комплектацией.",
    images: ["/images/demo/noir-suv.svg", "/images/demo/atlas-suv.svg"],
  },
  {
    brand: "Geely",
    model: "Monjaro",
    year: 2024,
    price: 3890000,
    mileage: 4000,
    vin: "LBV3B5EC9RE103512",
    color: "Storm Grey",
    city: "Ростов-на-Дону",
    engineVolume: 2.0,
    horsepower: 238,
    bodyType: BodyType.CROSSOVER,
    fuelType: FuelType.PETROL,
    transmission: Transmission.AUTOMATIC,
    driveType: DriveType.AWD,
    featured: true,
    status: CarStatus.AVAILABLE,
    description:
      "Почти новый флагманский кроссовер с большим экраном, вентиляцией сидений и пакетом ассистентов.",
    images: ["/images/demo/skyline-crossover.svg", "/images/demo/atlas-suv.svg"],
  },
  {
    brand: "Mazda",
    model: "CX-5",
    year: 2021,
    price: 3090000,
    mileage: 29000,
    vin: "JMZKF4WLA00184519",
    color: "Soul Red",
    city: "Самара",
    engineVolume: 2.5,
    horsepower: 194,
    bodyType: BodyType.CROSSOVER,
    fuelType: FuelType.PETROL,
    transmission: Transmission.AUTOMATIC,
    driveType: DriveType.AWD,
    featured: false,
    status: CarStatus.AVAILABLE,
    description:
      "Тихий и надежный кроссовер с премиальным салоном и высоким уровнем пассивной безопасности.",
    images: ["/images/demo/skyline-crossover.svg", "/images/demo/noir-suv.svg"],
  },
  {
    brand: "Renault",
    model: "Arkana",
    year: 2022,
    price: 2290000,
    mileage: 31000,
    vin: "X7LJF1A0HN8945211",
    color: "Cafe Brown",
    city: "Тула",
    engineVolume: 1.3,
    horsepower: 150,
    bodyType: BodyType.CROSSOVER,
    fuelType: FuelType.PETROL,
    transmission: Transmission.CVT,
    driveType: DriveType.FWD,
    featured: false,
    status: CarStatus.AVAILABLE,
    description:
      "Стильный купе-кроссовер с подогревом лобового стекла, камерой и низкой стоимостью владения.",
    images: ["/images/demo/skyline-crossover.svg", "/images/demo/ember-sedan.svg"],
  },
  {
    brand: "Ford",
    model: "Explorer",
    year: 2018,
    price: 3350000,
    mileage: 89000,
    vin: "1FM5K8GT5JGA20155",
    color: "Magnetic Grey",
    city: "Краснодар",
    engineVolume: 3.5,
    horsepower: 249,
    bodyType: BodyType.SUV,
    fuelType: FuelType.PETROL,
    transmission: Transmission.AUTOMATIC,
    driveType: DriveType.AWD,
    featured: false,
    status: CarStatus.RESERVED,
    description:
      "Большой SUV для семьи и путешествий: 7 мест, просторный третий ряд и полный привод.",
    images: ["/images/demo/noir-suv.svg", "/images/demo/atlas-suv.svg"],
  },
  {
    brand: "Tesla",
    model: "Model 3",
    year: 2021,
    price: 3990000,
    mileage: 44000,
    vin: "5YJ3E7EA7MF315208",
    color: "Midnight Silver",
    city: "Москва",
    engineVolume: 0,
    horsepower: 325,
    bodyType: BodyType.SEDAN,
    fuelType: FuelType.ELECTRIC,
    transmission: Transmission.AUTOMATIC,
    driveType: DriveType.AWD,
    featured: true,
    status: CarStatus.AVAILABLE,
    description:
      "Электроседан с автопилотом, минималистичным интерьером и впечатляющей динамикой разгона.",
    images: ["/images/demo/lumen-sedan.svg", "/images/demo/ember-sedan.svg"],
  },
  {
    brand: "Toyota",
    model: "Land Cruiser Prado",
    year: 2019,
    price: 5290000,
    mileage: 71000,
    vin: "JTEBR3FJ70K160214",
    color: "Sandstone",
    city: "Уфа",
    engineVolume: 2.8,
    horsepower: 177,
    bodyType: BodyType.SUV,
    fuelType: FuelType.DIESEL,
    transmission: Transmission.AUTOMATIC,
    driveType: DriveType.AWD,
    featured: true,
    status: CarStatus.AVAILABLE,
    description:
      "Рамный внедорожник с репутацией надежности, пневмоподвеской и отличной ликвидностью.",
    images: ["/images/demo/atlas-suv.svg", "/images/demo/noir-suv.svg"],
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  await prisma.favorite.deleteMany();
  await prisma.order.deleteMany();
  await prisma.carImage.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash("Client12345!", 10);
  const managerPasswordHash = await bcrypt.hash("Manager12345!", 10);
  const adminPasswordHash = await bcrypt.hash("Admin12345!", 10);

  const [admin, managerOne, managerTwo, clientOne, clientTwo] = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@prcar.local",
        passwordHash: adminPasswordHash,
        name: "Елена Демина",
        phone: "+7 (925) 100-20-30",
        role: UserRole.ADMIN,
        consentToPersonalData: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "manager.one@prcar.local",
        passwordHash: managerPasswordHash,
        name: "Михаил Орлов",
        phone: "+7 (926) 111-22-33",
        role: UserRole.MANAGER,
        consentToPersonalData: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "manager.two@prcar.local",
        passwordHash: managerPasswordHash,
        name: "Анна Котова",
        phone: "+7 (926) 444-55-66",
        role: UserRole.MANAGER,
        consentToPersonalData: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "client.one@prcar.local",
        passwordHash: defaultPasswordHash,
        name: "Алексей Петров",
        phone: "+7 (915) 700-10-20",
        role: UserRole.CLIENT,
        consentToPersonalData: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "client.two@prcar.local",
        passwordHash: defaultPasswordHash,
        name: "Алина Соколова",
        phone: "+7 (916) 555-44-33",
        role: UserRole.CLIENT,
        consentToPersonalData: true,
      },
    }),
  ]);

  const createdCars = [];

  for (const [index, car] of carFixtures.entries()) {
    const createdCar = await prisma.car.create({
      data: {
        slug: `${slugify(car.brand)}-${slugify(car.model)}-${car.year}-${index + 1}`,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        vin: car.vin,
        color: car.color,
        city: car.city,
        engineVolume: car.engineVolume,
        horsepower: car.horsepower,
        description: car.description,
        bodyType: car.bodyType,
        fuelType: car.fuelType,
        transmission: car.transmission,
        driveType: car.driveType,
        featured: car.featured,
        status: car.status,
        createdById: index % 2 === 0 ? managerOne.id : managerTwo.id,
        images: {
          create: car.images.map((url, imageIndex) => ({
            key: `seed:${url}`,
            url,
            alt: `${car.brand} ${car.model} — фото ${imageIndex + 1}`,
            sortOrder: imageIndex,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    createdCars.push(createdCar);
  }

  await prisma.favorite.createMany({
    data: [
      { userId: clientOne.id, carId: createdCars[0].id },
      { userId: clientOne.id, carId: createdCars[3].id },
      { userId: clientTwo.id, carId: createdCars[8].id },
    ],
  });

  await prisma.order.createMany({
    data: [
      {
        userId: clientOne.id,
        carId: createdCars[1].id,
        managerId: managerOne.id,
        fullName: clientOne.name,
        phone: clientOne.phone,
        comment: "Интересует обмен по trade-in и проверка сервиса.",
        type: OrderType.TEST_DRIVE,
        status: OrderStatus.IN_PROGRESS,
        consentToPersonalData: true,
      },
      {
        userId: clientTwo.id,
        carId: createdCars[4].id,
        managerId: managerTwo.id,
        fullName: clientTwo.name,
        phone: clientTwo.phone,
        comment: "Нужен расчет кредита на 36 месяцев.",
        type: OrderType.CREDIT,
        status: OrderStatus.NEW,
        consentToPersonalData: true,
      },
      {
        userId: clientOne.id,
        carId: createdCars[10].id,
        managerId: managerOne.id,
        fullName: clientOne.name,
        phone: clientOne.phone,
        comment: "Хочу зарезервировать до субботы.",
        type: OrderType.RESERVATION,
        status: OrderStatus.APPROVED,
        consentToPersonalData: true,
      },
    ],
  });

  console.info("Seed finished successfully.");
  console.info("Admin:", admin.email, "Password: Admin12345!");
  console.info("Manager:", managerOne.email, "Password: Manager12345!");
  console.info("Client:", clientOne.email, "Password: Client12345!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
