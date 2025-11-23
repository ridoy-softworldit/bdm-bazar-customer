export interface TAuthor {
  _id: string;
  name: string;
  image: string;
  followersCount: number;
  description: string;
  __v: number;
}

export interface AuthorApiResponse {
  success: boolean;
  message: string;
  meta: null;
  data: TAuthor[];
}

export const transformAuthorResponse = (response: AuthorApiResponse): TAuthor[] => {
  return response.data;
};
