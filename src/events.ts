import { z } from 'zod';

export const AuthUserRegisteredSchema = z
  .object({
    userId: z.string(),
    email: z.string().email(),
    createdAt: z.string().datetime(),
  })
  .strict();
export type AuthUserRegistered = z.infer<typeof AuthUserRegisteredSchema>;

export const AuthSessionRevokedSchema = z
  .object({
    userId: z.string(),
    sessionId: z.string(),
    reason: z.enum(['logout', 'expired', 'reuse_detected', 'admin']),
  })
  .strict();
export type AuthSessionRevoked = z.infer<typeof AuthSessionRevokedSchema>;

export const CoreProfileUpdatedSchema = z
  .object({
    userId: z.string(),
    username: z.string().optional(),
    name: z.string().nullable().optional(),
    avatarUrl: z.string().nullable().optional(),
    updatedAt: z.string().datetime(),
  })
  .strict();
export type CoreProfileUpdated = z.infer<typeof CoreProfileUpdatedSchema>;

export const VoiceCallRingingSchema = z
  .object({
    callId: z.string(),
    fromUserId: z.string(),
    toUserId: z.string(),
    startedAt: z.string().datetime(),
  })
  .strict();
export type VoiceCallRinging = z.infer<typeof VoiceCallRingingSchema>;

export const AuthUserRegisteredEventSchema = z.object({
  type: z.literal('auth.user.registered'),
  payload: AuthUserRegisteredSchema,
});

export const AuthSessionRevokedEventSchema = z.object({
  type: z.literal('auth.session.revoked'),
  payload: AuthSessionRevokedSchema,
});

export const CoreProfileUpdatedEventSchema = z.object({
  type: z.literal('core.profile.updated'),
  payload: CoreProfileUpdatedSchema,
});

export const VoiceCallRingingEventSchema = z.object({
  type: z.literal('voice.call.ringing'),
  payload: VoiceCallRingingSchema,
});

export const EventSchema = z.discriminatedUnion('type', [
  AuthUserRegisteredEventSchema,
  AuthSessionRevokedEventSchema,
  CoreProfileUpdatedEventSchema,
  VoiceCallRingingEventSchema,
]);

export type ZenuxsEvent =
  | { type: 'auth.user.registered'; payload: AuthUserRegistered }
  | { type: 'auth.session.revoked'; payload: AuthSessionRevoked }
  | { type: 'core.profile.updated'; payload: CoreProfileUpdated }
  | { type: 'voice.call.ringing'; payload: VoiceCallRinging };

/**
 * Validates `{ type, payload }` against the corresponding event schema.
 * Throws ZodError on mismatch or unknown event type.
 */
export function parseEvent(raw: unknown): ZenuxsEvent {
  return EventSchema.parse(raw);
}

/**
 * Safe version of parseEvent returning a Zod SafeParseReturnType.
 */
export function safeParseEvent(raw: unknown) {
  return EventSchema.safeParse(raw);
}
