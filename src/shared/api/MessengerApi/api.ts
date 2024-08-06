import axios, { AxiosInstance } from 'axios';

import {
  ApproveDto,
  Chat,
  ChatWithPagination,
  SigninDto,
  SignupDto,
  Success,
  TExists,
  TokensDto,
  UpdateUserDto,
  User,
} from './generated/data-contracts';

class MessengerApi {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_MESSENGER_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const {
          config,
          response: { status },
        } = error;
        if (status === 401) {
          const tokens = await axios
            .post(`${import.meta.env.VITE_MESSENGER_API_URL}auth/refresh`, {}, { withCredentials: true })
            .then((res) => res.data);

          localStorage.setItem('token', tokens.accessToken);

          return this.api(config);
        }

        return Promise.reject(error);
      },
    );
  }

  signUp(data: SignupDto) {
    return this.api.post<Success>('auth/signup', data).then((response) => response.data);
  }

  signIn(data: SigninDto) {
    return this.api.post<Success>('auth/signin', data).then((response) => response.data);
  }

  signInApproved(data: ApproveDto) {
    return this.api.post<TokensDto>('auth/signin/approved', data).then((response) => {
      localStorage.setItem('token', response.data.accessToken);
      return response.data;
    });
  }

  approve(data: ApproveDto) {
    return this.api.post<TokensDto>('auth/approve', data).then((response) => {
      localStorage.setItem('token', response.data.accessToken);
      return response.data;
    });
  }

  logout() {
    return this.api.delete<Success>('auth/logout').then((response) => response.data);
  }

  getUsers({ search, page, limit }: { search: string; page: number; limit: number }) {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.api.get<User[]>(`users?${params.toString()}`).then((response) => response.data);
  }

  getUserMe() {
    return this.api.get<User>('users/me').then((response) => response.data);
  }

  editUserMe(data: UpdateUserDto) {
    return this.api.patch<User>('users/me', data).then((response) => response.data);
  }

  getUserExists(email: string) {
    return this.api.get<TExists>(`users/exists/${email}`).then((response) => response.data);
  }

  getChatMessages(roomId: string, page = 1, limit = 30) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.api
      .get<ChatWithPagination>(`chat/messages/${roomId}?${params.toString()}`)
      .then((response) => response.data);
  }

  deleteMessage(roomId: string) {
    return this.api.delete<ChatWithPagination>(`chat/deleteChat/${roomId}`).then((response) => response.data);
  }

  getUsersBySearch({ limit, page, search }: { search: string; page: number; limit: number }) {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.api.get<{ data: User[] }>(`users?${params.toString()}`).then((response) => response.data);
  }

  createChat(recipeintId: string) {
    return this.api.post<Chat>(`chat/createChat/${recipeintId}`).then((response) => response.data);
  }

  deleteChat(recipeintId: string, roomId: string) {
    return this.api.delete<Chat>(`chat/deleteChat/${roomId}/${recipeintId}`).then((response) => response.data);
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.api
      .post<string[]>('files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((response) => response.data);
  }
}

export const messengerApi = new MessengerApi();
