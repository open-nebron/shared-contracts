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
    callerId: z.string(),
    calleeId: z.string(),
    roomName: z.string(),
    startedAt: z.string().datetime(),
  })
  .strict();
export type VoiceCallRinging = z.infer<typeof VoiceCallRingingSchema>;

export const VoiceCallAcceptedSchema = z
  .object({
    callId: z.string(),
    callerId: z.string(),
    calleeId: z.string(),
    acceptedAt: z.string().datetime(),
  })
  .strict();
export type VoiceCallAccepted = z.infer<typeof VoiceCallAcceptedSchema>;

export const VoiceCallRejectedSchema = z
  .object({
    callId: z.string(),
    callerId: z.string(),
    calleeId: z.string(),
    rejectedBy: z.string(),
    reason: z.string(),
    at: z.string().datetime(),
  })
  .strict();
export type VoiceCallRejected = z.infer<typeof VoiceCallRejectedSchema>;

export const VoiceCallEndedSchema = z
  .object({
    callId: z.string(),
    callerId: z.string(),
    calleeId: z.string(),
    endedBy: z.string().nullable(),
    reason: z.enum(['hangup', 'reject', 'missed', 'cancelled', 'error', 'livekit_closed']),
    at: z.string().datetime(),
  })
  .strict();
export type VoiceCallEnded = z.infer<typeof VoiceCallEndedSchema>;

export const VoiceCallMissedSchema = z
  .object({
    callId: z.string(),
    callerId: z.string(),
    calleeId: z.string(),
    at: z.string().datetime(),
  })
  .strict();
export type VoiceCallMissed = z.infer<typeof VoiceCallMissedSchema>;

export const VoiceCallCancelledSchema = z
  .object({
    callId: z.string(),
    callerId: z.string(),
    calleeId: z.string(),
    cancelledBy: z.string().optional(),
    at: z.string().datetime(),
  })
  .strict();
export type VoiceCallCancelled = z.infer<typeof VoiceCallCancelledSchema>;

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

export const ChatConversationCreatedSchema = z
  .object({
    conversationId: z.string(),
    kind: z.literal('group'),
    name: z.string(),
    ownerId: z.string(),
    memberIds: z.array(z.string()),
    createdAt: z.string().datetime(),
  })
  .strict();
export type ChatConversationCreated = z.infer<typeof ChatConversationCreatedSchema>;

export const ChatConversationMemberAddedSchema = z
  .object({
    conversationId: z.string(),
    addedBy: z.string(),
    userIds: z.array(z.string()),
    at: z.string().datetime(),
  })
  .strict();
export type ChatConversationMemberAdded = z.infer<typeof ChatConversationMemberAddedSchema>;

export const ChatConversationMemberRemovedSchema = z
  .object({
    conversationId: z.string(),
    removedBy: z.string(),
    userId: z.string(),
    at: z.string().datetime(),
    newOwnerId: z.string().optional(),
  })
  .strict();
export type ChatConversationMemberRemoved = z.infer<typeof ChatConversationMemberRemovedSchema>;

export const ChatConversationRenamedSchema = z
  .object({
    conversationId: z.string(),
    renamedBy: z.string(),
    newName: z.string(),
    at: z.string().datetime(),
  })
  .strict();
export type ChatConversationRenamed = z.infer<typeof ChatConversationRenamedSchema>;

export const ChatConversationDeletedSchema = z
  .object({
    conversationId: z.string(),
    deletedBy: z.string(),
    at: z.string().datetime(),
  })
  .strict();
export type ChatConversationDeleted = z.infer<typeof ChatConversationDeletedSchema>;

export const ChatConversationRequestAcceptedSchema = z
  .object({
    conversationId: z.string(),
    acceptedBy: z.string(),
    at: z.string().datetime(),
  })
  .strict();
export type ChatConversationRequestAccepted = z.infer<typeof ChatConversationRequestAcceptedSchema>;

export const ChatConversationRequestRejectedSchema = z
  .object({
    conversationId: z.string(),
    rejectedBy: z.string(),
    at: z.string().datetime(),
  })
  .strict();
export type ChatConversationRequestRejected = z.infer<typeof ChatConversationRequestRejectedSchema>;

export const ChatMessageEditedSchema = z
  .object({
    conversationId: z.string(),
    messageId: z.string(),
    senderId: z.string(),
    body: z.string(),
    editedAt: z.string().datetime(),
  })
  .strict();
export type ChatMessageEdited = z.infer<typeof ChatMessageEditedSchema>;

export const ChatMessageStarredSchema = z
  .object({
    userId: z.string(),
    conversationId: z.string(),
    messageId: z.string(),
    starredAt: z.string().datetime(),
  })
  .strict();
export type ChatMessageStarred = z.infer<typeof ChatMessageStarredSchema>;

export const ChatMessageUnstarredSchema = z
  .object({
    userId: z.string(),
    conversationId: z.string(),
    messageId: z.string(),
    at: z.string().datetime(),
  })
  .strict();
export type ChatMessageUnstarred = z.infer<typeof ChatMessageUnstarredSchema>;

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

export const VoiceCallAcceptedEventSchema = z.object({
  type: z.literal('voice.call.accepted'),
  payload: VoiceCallAcceptedSchema,
});

export const VoiceCallRejectedEventSchema = z.object({
  type: z.literal('voice.call.rejected'),
  payload: VoiceCallRejectedSchema,
});

export const VoiceCallEndedEventSchema = z.object({
  type: z.literal('voice.call.ended'),
  payload: VoiceCallEndedSchema,
});

export const VoiceCallMissedEventSchema = z.object({
  type: z.literal('voice.call.missed'),
  payload: VoiceCallMissedSchema,
});

export const VoiceCallCancelledEventSchema = z.object({
  type: z.literal('voice.call.cancelled'),
  payload: VoiceCallCancelledSchema,
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

export const ChatConversationCreatedEventSchema = z.object({
  type: z.literal('chat.conversation.created'),
  payload: ChatConversationCreatedSchema,
});

export const ChatConversationMemberAddedEventSchema = z.object({
  type: z.literal('chat.conversation.member_added'),
  payload: ChatConversationMemberAddedSchema,
});

export const ChatConversationMemberRemovedEventSchema = z.object({
  type: z.literal('chat.conversation.member_removed'),
  payload: ChatConversationMemberRemovedSchema,
});

export const ChatConversationRenamedEventSchema = z.object({
  type: z.literal('chat.conversation.renamed'),
  payload: ChatConversationRenamedSchema,
});

export const ChatConversationDeletedEventSchema = z.object({
  type: z.literal('chat.conversation.deleted'),
  payload: ChatConversationDeletedSchema,
});

export const ChatConversationRequestAcceptedEventSchema = z.object({
  type: z.literal('chat.conversation.request_accepted'),
  payload: ChatConversationRequestAcceptedSchema,
});

export const ChatConversationRequestRejectedEventSchema = z.object({
  type: z.literal('chat.conversation.request_rejected'),
  payload: ChatConversationRequestRejectedSchema,
});

export const ChatMessageEditedEventSchema = z.object({
  type: z.literal('chat.message.edited'),
  payload: ChatMessageEditedSchema,
});

export const ChatMessageStarredEventSchema = z.object({
  type: z.literal('chat.message.starred'),
  payload: ChatMessageStarredSchema,
});

export const ChatMessageUnstarredEventSchema = z.object({
  type: z.literal('chat.message.unstarred'),
  payload: ChatMessageUnstarredSchema,
});

export const EventSchema = z.discriminatedUnion('type', [
  AuthUserRegisteredEventSchema,
  AuthSessionRevokedEventSchema,
  CoreProfileUpdatedEventSchema,
  VoiceCallRingingEventSchema,
  VoiceCallAcceptedEventSchema,
  VoiceCallRejectedEventSchema,
  VoiceCallEndedEventSchema,
  VoiceCallMissedEventSchema,
  VoiceCallCancelledEventSchema,
  CoreRelationshipBlockedEventSchema,
  CoreRelationshipUnblockedEventSchema,
  CoreRelationshipMutedEventSchema,
  CoreRelationshipUnmutedEventSchema,
  ChatConversationCreatedEventSchema,
  ChatConversationMemberAddedEventSchema,
  ChatConversationMemberRemovedEventSchema,
  ChatConversationRenamedEventSchema,
  ChatConversationDeletedEventSchema,
  ChatConversationRequestAcceptedEventSchema,
  ChatConversationRequestRejectedEventSchema,
  ChatMessageEditedEventSchema,
  ChatMessageStarredEventSchema,
  ChatMessageUnstarredEventSchema,
]);

export type NebronEvent =
  | { type: 'auth.user.registered'; payload: AuthUserRegistered }
  | { type: 'auth.session.revoked'; payload: AuthSessionRevoked }
  | { type: 'core.profile.updated'; payload: CoreProfileUpdated }
  | { type: 'voice.call.ringing'; payload: VoiceCallRinging }
  | { type: 'voice.call.accepted'; payload: VoiceCallAccepted }
  | { type: 'voice.call.rejected'; payload: VoiceCallRejected }
  | { type: 'voice.call.ended'; payload: VoiceCallEnded }
  | { type: 'voice.call.missed'; payload: VoiceCallMissed }
  | { type: 'voice.call.cancelled'; payload: VoiceCallCancelled }
  | { type: 'core.relationship.blocked'; payload: CoreRelationshipBlocked }
  | { type: 'core.relationship.unblocked'; payload: CoreRelationshipUnblocked }
  | { type: 'core.relationship.muted'; payload: CoreRelationshipMuted }
  | { type: 'core.relationship.unmuted'; payload: CoreRelationshipUnmuted }
  | { type: 'chat.conversation.created'; payload: ChatConversationCreated }
  | { type: 'chat.conversation.member_added'; payload: ChatConversationMemberAdded }
  | { type: 'chat.conversation.member_removed'; payload: ChatConversationMemberRemoved }
  | { type: 'chat.conversation.renamed'; payload: ChatConversationRenamed }
  | { type: 'chat.conversation.deleted'; payload: ChatConversationDeleted }
  | { type: 'chat.conversation.request_accepted'; payload: ChatConversationRequestAccepted }
  | { type: 'chat.conversation.request_rejected'; payload: ChatConversationRequestRejected }
  | { type: 'chat.message.edited'; payload: ChatMessageEdited }
  | { type: 'chat.message.starred'; payload: ChatMessageStarred }
  | { type: 'chat.message.unstarred'; payload: ChatMessageUnstarred };

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
