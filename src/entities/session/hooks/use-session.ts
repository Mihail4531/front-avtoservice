import { useSessionStore } from '../model/store';
import { selectUser, selectIsAuth, selectIsInitialized } from '../lib/selectors';

export const useSession = () => {
    const user = useSessionStore(selectUser);
    const isAuth = useSessionStore(selectIsAuth);
    const isInitialized = useSessionStore(selectIsInitialized);
    const initAuth = useSessionStore((state) => state.initAuth);
    const logout = useSessionStore((state) => state.logout);

    return { user, isAuth, isInitialized, initAuth, logout };
};
