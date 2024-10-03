import type { ProjectsQuery, RoundsQuery } from "../../types";

export const ipfsGateway = (cid: string) => {
  if (!cid) return "";
  return cid?.includes("http") ? cid : `https://ipfs.io/ipfs/${cid}`;
};

export function queryToFilter(query: RoundsQuery | ProjectsQuery) {
  const filter = query.where;

  /* 
  
  Queries can contain nested props. For example the round query:
  {
    where: {
    applications: {
      where: { status: { in: ["APPROVED"] } },
      orderBy: { status: "asc" },
    },
    roles: {
      where: { role: { in: ["ADMIN"] } },
    },
  }

  TODO: Currently only implemented in roundsQuery. Update applicationsQuery and projectsQuery.
  */
  const nestedKeys = ["applications", "projects"];
  const nestedFilters = nestedKeys.reduce((acc, key) => {
    if (!filter?.[key as keyof typeof filter]) return acc;
    const { where, orderBy } = pick(filter, [key])?.[key];
    return {
      ...acc,
      [`${key}_filter`]: where,
      [`${key}_orderBy`]: mapOrderBy(orderBy),
    };
  }, {});

  return {
    filter: removeEmpty(omit(filter, nestedKeys)),
    ...nestedFilters,
    offset: query.offset,
    first: query.first,
    orderBy: mapOrderBy(query.orderBy),
  };
}
function mapOrderBy(obj: unknown) {
  return Object.entries(obj ?? {})[0]
    ?.map((v) => v.toUpperCase())
    .join("_");
}
function removeEmpty(obj: unknown) {
  return Object.keys(obj as {})?.length ? obj : undefined;
}
function omit(obj: unknown, keys: string[]) {
  return Object.fromEntries(
    Object.entries(obj as {}).filter(([key]) => !keys.includes(key)),
  );
}
function pick(obj: unknown, keys: string[]): any {
  return Object.fromEntries(
    Object.entries(obj as {}).filter(([key]) => keys.includes(key)),
  );
}
