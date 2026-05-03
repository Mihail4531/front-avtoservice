// entities/session/model/keys.ts
export const sessionKeys = {
    me: ['me'] as const,
};

export type SessionQueryKey = typeof sessionKeys.me;
