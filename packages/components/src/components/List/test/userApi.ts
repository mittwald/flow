import { faker } from "@faker-js/faker";
import { times } from "remeda";
import { AsyncDataLoader } from "@/components/List/model/loading/types";

const companies = times(10, (i) => i).map(faker.company.name);

const createRandomUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName({
      firstName,
      lastName,
    }),
    firstName,
    lastName,
    email: faker.internet.email({
      firstName,
      lastName,
    }),
    avatar: faker.image.avatar(),
    company: faker.helpers.arrayElement(companies),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
    isDisabled: faker.datatype.boolean(0.1),
  };
};

export type User = ReturnType<typeof createRandomUser>;

const users = times(500, (i) => i).map(createRandomUser);

const apiSleep = (): Promise<void> =>
  new Promise((res) =>
    window.setTimeout(res, faker.number.int({ min: 200, max: 1200 })),
  );

export const getUsers: AsyncDataLoader<User> = async (opts = {}) => {
  const { filtering, pagination } = opts;

  console.log("API call", opts);
  await apiSleep();
  const companies = filtering?.company?.values;

  const preFilteredData =
    companies === undefined
      ? users
      : users.filter(
          (u) => companies.length === 0 || companies.includes(u.company),
        );
  const itemTotalCount = preFilteredData.length;

  return {
    data: pagination
      ? preFilteredData.slice(
          pagination.offset,
          pagination.offset + pagination.limit,
        )
      : preFilteredData,
    itemTotalCount,
  };
};

export const getCompanies = async () => {
  await apiSleep();
  return companies;
};
