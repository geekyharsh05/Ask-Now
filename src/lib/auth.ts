import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import sendEmail from "@/app/actions/send-email";
 
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 * 7, // 7 days (every 7 days the session expiration is updated)
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60 // Cache duration in seconds
        }
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
              to: user.email,
              subject: "Reset your password",
              text: `Click the link to reset your password: ${url}`,
            });
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, token }) => {
            const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
            await sendEmail ({
              to: user.email,
              subject: "Verify your email address",
              text: `Click the link to verify your email: ${verificationUrl}`,
            });
        }
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                input: true,
            },
        },
    },

} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;