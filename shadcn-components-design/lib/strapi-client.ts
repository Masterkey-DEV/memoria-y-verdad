import { API_URL } from "@/const/api";

type StrapiResponse<T> = {
  data: T;
};

type FetchStrapiOptions = RequestInit & {
  query?: URLSearchParams;
};

export async function fetchStrapi<T>(
  endpoint: string,
  { query, ...init }: FetchStrapiOptions = {},
): Promise<StrapiResponse<T>> {
  const queryString = query?.toString();
  const url = `${API_URL}${endpoint}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar ${endpoint}`);
  }

  return response.json() as Promise<StrapiResponse<T>>;
}

export function buildQuery(
  params: Record<string, string | number | boolean | undefined | null>,
) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return query;
}
