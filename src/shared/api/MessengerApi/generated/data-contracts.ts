/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SignupDto {
  email: string;
  username?: string;
  firstname: string;
  lastname?: string;
}

export interface Success {
  success: boolean;
}

export interface SigninDto {
  email: string;
}

export interface TokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface ApproveDto {
  approveCode: string;
  email: string;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  replyMessage: string;
  forwardedMessage: string;
  chatId: string;
  images?: string[];
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  isEdited: boolean;
  status?: 'pending' | 'success' | 'error';
}

export interface Chat {
  id: string;
  users: User[];
  messages: Message[];
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  isOnline: boolean;
  lastOnline: number;
  dialogs: Chat[];
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface UpdateUserDto {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
}

export interface TExists {
  exists: boolean;
  isHaveApproveCode: boolean;
}

export interface ChatWithPagination {
  data: Message[];
  groupedMessages: {
    [key: string]: Message[];
  };
  users: User[];
  total: number;
  page: number;
  limit: number;
}
