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

export const RelationshipMuteSchema = z
  .object({
    calls: z.boolean(),
    messages: z.boolean(),
    until: z.string().datetime().nullable(),
  })
  .strict();
export type RelationshipMute = z.infer<typeof RelationshipMuteSchema>;

export const CoreRelationshipBlockedSchema = z
  .object({
    fromUserId: z.string(),
    toUserId: z.string(),
    at: z.string().datetime(),
  })
  .strict();
export type CoreRelationshipBlocked = z.infer<typeof CoreRelationshipBlockedSchema>;

export const CoreRelationshipUnblockedSchema = z
  .object({
    fromUserId: z.string(),
    toUserId: z.string(),
    at: z.string().datetime(),
  })
  .strict();
export type CoreRelationshipUnblocked = z.infer<typeof CoreRelationshipUnblockedSchema>;

export const CoreRelationshipMutedSchema = z
  .object({
    fromUserId: z.string(),
    toUserId: z.string(),
    mute: RelationshipMuteSchema,
    at: z.string().datetime(),
  })
  .strict();
export type CoreRelationshipMuted = z.infer<typeof CoreRelationshipMutedSchema>;

export const CoreRelationshipUnmutedSchema = z
  .object({
    fromUserId: z.string(),
    toUserId: z.string(),
    at: z.string().datetime(),
  })
  .strict();
export type CoreRelationshipUnmuted = z.infer<typeof CoreRelationshipUnmutedSchema>;

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

export const CoreRelationshipBlockedEventSchema = z.object({
  type: z.literal('core.relationship.blocked'),
  payload: CoreRelationshipBlockedSchema,
});

export const CoreRelationshipUnblockedEventSchema = z.object({
  type: z.literal('core.relationship.unblocked'),
  payload: CoreRelationshipUnblockedSchema,
});

export const CoreRelationshipMutedEventSchema = z.object({
  type: z.literal('core.relationship.muted'),
  payload: CoreRelationshipMutedSchema,
});

export const CoreRelationshipUnmutedEventSchema = z.object({
  type: z.literal('core.relationship.unmuted'),
  payload: CoreRelationshipUnmutedSchema,
});

export const EventSchema = z.discriminatedUnion('type', [
  AuthUserRegisteredEventSchema,
  AuthSessionRevokedEventSchema,
  CoreProfileUpdatedEventSchema,
  VoiceCallRingingEventSchema,
  CoreRelationshipBlockedEventSchema,
  CoreRelationshipUnblockedEventSchema,
  CoreRelationshipMutedEventSchema,
  CoreRelationshipUnmutedEventSchema,
]);

export type NebronEvent =
  | { type: 'auth.user.registered'; payload: AuthUserRegistered }
  | { type: 'auth.session.revoked'; payload: AuthSessionRevoked }
  | { type: 'core.profile.updated'; payload: CoreProfileUpdated }
  | { type: 'voice.call.ringing'; payload: VoiceCallRinging }
  | { type: 'core.relationship.blocked'; payload: CoreRelationshipBlocked }
  | { type: 'core.relationship.unblocked'; payload: CoreRelationshipUnblocked }
  | { type: 'core.relationship.muted'; payload: CoreRelationshipMuted }
  | { type: 'core.relationship.unmuted'; payload: CoreRelationshipUnmuted };

/**
 * Validates `{ type, payload }` against the corresponding event schema.
 * Throws ZodError on mismatch or unknown event type.
 */
export function parseEvent(raw: unknown): NebronEvent {
  return EventSchema.parse(raw);
}

/**
 * Safe version of parseEvent returning a Zod SafeParseReturnType.
 */
export function safeParseEvent(raw: unknown) {
  return EventSchema.safeParse(raw);
}
