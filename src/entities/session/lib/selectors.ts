import type { SessionState } from '../model/types';

export const selectUser = (state: SessionState) => state.user;
export const selectIsAuth = (state: SessionState) => state.isAuth;
export const selectIsInitialized = (state: SessionState) => state.isInitialized;
