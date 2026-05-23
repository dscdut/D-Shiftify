export const JwtPayload = (user, ref) => (
    {
        id: user.id,
        roles: user.roles,
        ref
    }
);
