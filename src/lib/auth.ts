import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
 
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        // BUG: Prob a bug with updateAge method. It throws an error - Argument `where` of type SessionWhereUniqueInput needs at least one of `id` arguments. 
        // As a workaround, set updateAge to a large value for now.
        updateAge: 60 * 60 * 24 * 7, // 7 days (every 7 days the session expiration is updated)
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60 // Cache duration in seconds
        }
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        // sendResetPassword: async ({ user, url }) => {
        //     await sendEmail({
        //       to: user.email,
        //       subject: "Reset your password",
        //       text: `Click the link to reset your password: ${url}`,
        //     });
        // },
    },
}satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;