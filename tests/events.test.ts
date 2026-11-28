import { describe, it, expect } from 'vitest';
import {
  parseEvent,
  safeParseEvent,
  AuthUserRegisteredSchema,
  AuthSessionRevokedSchema,
  CoreProfileUpdatedSchema,
  VoiceCallRingingSchema,
  type NebronEvent,
} from '../src/events.js';

describe('Event Schemas and parseEvent', () => {
  describe('auth.user.registered', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'auth.user.registered',
        payload: {
          userId: 'usr_123',
          email: 'test@nebron.io',
          createdAt: '2026-11-17T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('auth.user.registered');
      expect(result.payload.userId).toBe('usr_123');
      expect(result.payload.email).toBe('test@nebron.io');
    });

    it('throws on invalid payload (missing fields / bad email)', () => {
      expect(() =>
        parseEvent({
          type: 'auth.user.registered',
          payload: {
            userId: 'usr_123',
          },
        })
      ).toThrow();

      expect(() =>
        parseEvent({
          type: 'auth.user.registered',
          payload: {
            userId: 'usr_123',
            email: 'not-an-email',
            createdAt: '2026-11-17T12:00:00.000Z',
          },
        })
      ).toThrow();

      expect(() =>
        parseEvent({
          type: 'auth.user.registered',
          payload: {
            userId: 'usr_123',
            email: 'test@nebron.io',
            createdAt: 'invalid-datetime',
          },
        })
      ).toThrow();
    });

    it('throws on extra properties (additionalProperties: false)', () => {
      expect(() =>
        parseEvent({
          type: 'auth.user.registered',
          payload: {
            userId: 'usr_123',
            email: 'test@nebron.io',
            createdAt: '2026-11-17T12:00:00.000Z',
            unexpectedField: true,
          },
        })
      ).toThrow();
    });
  });

  describe('auth.session.revoked', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'auth.session.revoked',
        payload: {
          userId: 'usr_123',
          sessionId: 'sess_abc',
          reason: 'logout',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('auth.session.revoked');
      expect(result.payload.reason).toBe('logout');
    });

    it('throws on invalid reason', () => {
      expect(() =>
        parseEvent({
          type: 'auth.session.revoked',
          payload: {
            userId: 'usr_123',
            sessionId: 'sess_abc',
            reason: 'other_reason',
          },
        })
      ).toThrow();
    });
  });

  describe('core.profile.updated', () => {
    it('succeeds on valid payload with optional and nullable fields', () => {
      const rawFull = {
        type: 'core.profile.updated',
        payload: {
          userId: 'usr_123',
          username: 'alexsmith',
          name: 'Alex Smith',
          avatarUrl: null,
          updatedAt: '2026-11-17T12:00:00.000Z',
        },
      };

      const result = parseEvent(rawFull);
      expect(result.type).toBe('core.profile.updated');
      if (result.type === 'core.profile.updated') {
        expect(result.payload.username).toBe('alexsmith');
        expect(result.payload.name).toBe('Alex Smith');
        expect(result.payload.avatarUrl).toBeNull();
      }

      const rawMinimal = {
        type: 'core.profile.updated',
        payload: {
          userId: 'usr_123',
          updatedAt: '2026-11-17T12:00:00.000Z',
        },
      };

      const resultMin = parseEvent(rawMinimal);
      expect(resultMin.type).toBe('core.profile.updated');
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'core.profile.updated',
          payload: {
            username: 'alex',
          },
        })
      ).toThrow();
    });
  });

  describe('voice.call.ringing', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'voice.call.ringing',
        payload: {
          callId: 'call_999',
          callerId: 'usr_1',
          calleeId: 'usr_2',
          roomName: 'room_123',
          startedAt: '2026-11-17T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('voice.call.ringing');
      if (result.type === 'voice.call.ringing') {
        expect(result.payload.callId).toBe('call_999');
        expect(result.payload.callerId).toBe('usr_1');
        expect(result.payload.calleeId).toBe('usr_2');
        expect(result.payload.roomName).toBe('room_123');
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'voice.call.ringing',
          payload: {
            callId: 'call_999',
          },
        })
      ).toThrow();
    });
  });

  describe('voice.call.accepted', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'voice.call.accepted',
        payload: {
          callId: 'call_999',
          callerId: 'usr_1',
          calleeId: 'usr_2',
          acceptedAt: '2026-11-17T12:00:05.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('voice.call.accepted');
      if (result.type === 'voice.call.accepted') {
        expect(result.payload.callId).toBe('call_999');
        expect(result.payload.acceptedAt).toBe('2026-11-17T12:00:05.000Z');
      }
    });
  });

  describe('voice.call.rejected', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'voice.call.rejected',
        payload: {
          callId: 'call_999',
          callerId: 'usr_1',
          calleeId: 'usr_2',
          rejectedBy: 'usr_2',
          reason: 'busy',
          at: '2026-11-17T12:00:05.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('voice.call.rejected');
      if (result.type === 'voice.call.rejected') {
        expect(result.payload.reason).toBe('busy');
      }
    });
  });

  describe('voice.call.ended', () => {
    it('succeeds on valid payload with endedBy string', () => {
      const raw = {
        type: 'voice.call.ended',
        payload: {
          callId: 'call_999',
          callerId: 'usr_1',
          calleeId: 'usr_2',
          endedBy: 'usr_1',
          reason: 'hangup',
          at: '2026-11-17T12:05:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('voice.call.ended');
      if (result.type === 'voice.call.ended') {
        expect(result.payload.endedBy).toBe('usr_1');
        expect(result.payload.reason).toBe('hangup');
      }
    });

    it('succeeds on valid payload with endedBy null (livekit_closed or error)', () => {
      const raw = {
        type: 'voice.call.ended',
        payload: {
          callId: 'call_999',
          callerId: 'usr_1',
          calleeId: 'usr_2',
          endedBy: null,
          reason: 'livekit_closed',
          at: '2026-11-17T12:05:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('voice.call.ended');
      if (result.type === 'voice.call.ended') {
        expect(result.payload.endedBy).toBeNull();
        expect(result.payload.reason).toBe('livekit_closed');
      }
    });
  });

  describe('voice.call.missed', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'voice.call.missed',
        payload: {
          callId: 'call_999',
          callerId: 'usr_1',
          calleeId: 'usr_2',
          at: '2026-11-17T12:01:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('voice.call.missed');
      if (result.type === 'voice.call.missed') {
        expect(result.payload.calleeId).toBe('usr_2');
      }
    });
  });

  describe('core.relationship.blocked', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.relationship.blocked',
        payload: {
          fromUserId: 'usr_from',
          toUserId: 'usr_to',
          at: '2026-11-19T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.relationship.blocked');
      if (result.type === 'core.relationship.blocked') {
        expect(result.payload.fromUserId).toBe('usr_from');
        expect(result.payload.toUserId).toBe('usr_to');
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'core.relationship.blocked',
          payload: {
            fromUserId: 'usr_from',
          },
        })
      ).toThrow();
    });
  });

  describe('core.relationship.unblocked', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.relationship.unblocked',
        payload: {
          fromUserId: 'usr_from',
          toUserId: 'usr_to',
          at: '2026-11-19T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.relationship.unblocked');
      if (result.type === 'core.relationship.unblocked') {
        expect(result.payload.fromUserId).toBe('usr_from');
        expect(result.payload.toUserId).toBe('usr_to');
      }
    });
  });

  describe('core.relationship.muted', () => {
    it('succeeds on valid payload with until set or null', () => {
      const raw = {
        type: 'core.relationship.muted',
        payload: {
          fromUserId: 'usr_from',
          toUserId: 'usr_to',
          mute: {
            calls: true,
            messages: false,
            until: '2026-11-20T12:00:00.000Z',
          },
          at: '2026-11-19T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.relationship.muted');
      if (result.type === 'core.relationship.muted') {
        expect(result.payload.mute.calls).toBe(true);
        expect(result.payload.mute.messages).toBe(false);
        expect(result.payload.mute.until).toBe('2026-11-20T12:00:00.000Z');
      }

      const rawNullUntil = {
        type: 'core.relationship.muted',
        payload: {
          fromUserId: 'usr_from',
          toUserId: 'usr_to',
          mute: {
            calls: false,
            messages: true,
            until: null,
          },
          at: '2026-11-19T12:00:00.000Z',
        },
      };
      const resNull = parseEvent(rawNullUntil);
      expect(resNull.type).toBe('core.relationship.muted');
    });

    it('throws on invalid mute fields', () => {
      expect(() =>
        parseEvent({
          type: 'core.relationship.muted',
          payload: {
            fromUserId: 'usr_from',
            toUserId: 'usr_to',
            mute: {
              calls: 'not_a_boolean',
            },
            at: '2026-11-19T12:00:00.000Z',
          },
        })
      ).toThrow();
    });
  });

  describe('core.relationship.unmuted', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.relationship.unmuted',
        payload: {
          fromUserId: 'usr_from',
          toUserId: 'usr_to',
          at: '2026-11-19T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.relationship.unmuted');
    });
  });

  describe('chat.conversation.created', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.conversation.created',
        payload: {
          conversationId: 'conv-123',
          kind: 'group',
          name: 'General Chat',
          ownerId: 'usr-1',
          memberIds: ['usr-1', 'usr-2'],
          createdAt: '2026-11-20T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.created');
      expect((result.payload as any).name).toBe('General Chat');
    });

    it('fails when kind is not group', () => {
      expect(() =>
        parseEvent({
          type: 'chat.conversation.created',
          payload: {
            conversationId: 'conv-123',
            kind: 'direct',
            name: 'General Chat',
            ownerId: 'usr-1',
            memberIds: ['usr-1', 'usr-2'],
            createdAt: '2026-11-20T12:00:00.000Z',
          },
        })
      ).toThrow();
    });
  });

  describe('chat.conversation.member_added', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.conversation.member_added',
        payload: {
          conversationId: 'conv-123',
          addedBy: 'usr-1',
          userIds: ['usr-3'],
          at: '2026-11-20T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.member_added');
    });
  });

  describe('chat.conversation.member_removed', () => {
    it('succeeds on valid payload with or without newOwnerId', () => {
      const raw = {
        type: 'chat.conversation.member_removed',
        payload: {
          conversationId: 'conv-123',
          removedBy: 'usr-1',
          userId: 'usr-2',
          at: '2026-11-20T12:00:00.000Z',
          newOwnerId: 'usr-3',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.member_removed');
      expect((result.payload as any).newOwnerId).toBe('usr-3');
    });
  });

  describe('chat.conversation.renamed', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.conversation.renamed',
        payload: {
          conversationId: 'conv-123',
          renamedBy: 'usr-1',
          newName: 'New Name',
          at: '2026-11-20T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.renamed');
      expect((result.payload as any).newName).toBe('New Name');
    });
  });

  describe('chat.conversation.deleted', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.conversation.deleted',
        payload: {
          conversationId: 'conv-123',
          deletedBy: 'usr-1',
          at: '2026-11-20T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.deleted');
    });
  });

  describe('chat.conversation.request_accepted', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.conversation.request_accepted',
        payload: {
          conversationId: 'conv-123',
          acceptedBy: 'usr-2',
          at: '2026-11-24T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.request_accepted');
      expect((result.payload as any).acceptedBy).toBe('usr-2');
    });

    it('throws on missing acceptedBy', () => {
      expect(() =>
        parseEvent({
          type: 'chat.conversation.request_accepted',
          payload: {
            conversationId: 'conv-123',
            at: '2026-11-24T12:00:00.000Z',
          },
        })
      ).toThrow();
    });
  });

  describe('chat.conversation.request_rejected', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.conversation.request_rejected',
        payload: {
          conversationId: 'conv-123',
          rejectedBy: 'usr-2',
          at: '2026-11-24T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.request_rejected');
      expect((result.payload as any).rejectedBy).toBe('usr-2');
    });

    it('throws on missing rejectedBy', () => {
      expect(() =>
        parseEvent({
          type: 'chat.conversation.request_rejected',
          payload: {
            conversationId: 'conv-123',
            at: '2026-11-24T12:00:00.000Z',
          },
        })
      ).toThrow();
    });
  });

  describe('chat.conversation.request_expired', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.conversation.request_expired',
        payload: {
          conversationId: 'conv-123',
          expiredAt: '2026-11-24T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.request_expired');
      if (result.type === 'chat.conversation.request_expired') {
        expect(result.payload.conversationId).toBe('conv-123');
        expect(result.payload.expiredAt).toBe('2026-11-24T12:00:00.000Z');
      }
    });

    it('throws on missing expiredAt', () => {
      expect(() =>
        parseEvent({
          type: 'chat.conversation.request_expired',
          payload: {
            conversationId: 'conv-123',
          },
        })
      ).toThrow();
    });
  });

  describe('chat.message.edited', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.message.edited',
        payload: {
          conversationId: 'conv-123',
          messageId: 'msg-456',
          senderId: 'usr-1',
          body: 'Hello edited',
          editedAt: '2026-11-24T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.message.edited');
      if (result.type === 'chat.message.edited') {
        expect(result.payload.body).toBe('Hello edited');
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'chat.message.edited',
          payload: {
            conversationId: 'conv-123',
            messageId: 'msg-456',
          },
        })
      ).toThrow();
    });
  });

  describe('chat.message.starred', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.message.starred',
        payload: {
          userId: 'usr-1',
          conversationId: 'conv-123',
          messageId: 'msg-456',
          starredAt: '2026-11-24T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.message.starred');
      if (result.type === 'chat.message.starred') {
        expect(result.payload.userId).toBe('usr-1');
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'chat.message.starred',
          payload: {
            userId: 'usr-1',
          },
        })
      ).toThrow();
    });
  });

  describe('chat.message.unstarred', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.message.unstarred',
        payload: {
          userId: 'usr-1',
          conversationId: 'conv-123',
          messageId: 'msg-456',
          at: '2026-11-24T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.message.unstarred');
      if (result.type === 'chat.message.unstarred') {
        expect(result.payload.userId).toBe('usr-1');
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'chat.message.unstarred',
          payload: {
            userId: 'usr-1',
          },
        })
      ).toThrow();
    });
  });

  describe('chat.message.reaction.added', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.message.reaction.added',
        payload: {
          conversationId: 'conv-123',
          messageId: 'msg-456',
          emoji: 'thumbs_up',
          userId: 'usr-1',
          createdAt: '2026-11-24T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.message.reaction.added');
      if (result.type === 'chat.message.reaction.added') {
        expect(result.payload.emoji).toBe('thumbs_up');
        expect(result.payload.userId).toBe('usr-1');
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'chat.message.reaction.added',
          payload: {
            conversationId: 'conv-123',
          },
        })
      ).toThrow();
    });
  });

  describe('chat.message.reaction.removed', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.message.reaction.removed',
        payload: {
          conversationId: 'conv-123',
          messageId: 'msg-456',
          emoji: 'thumbs_up',
          userId: 'usr-1',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.message.reaction.removed');
      if (result.type === 'chat.message.reaction.removed') {
        expect(result.payload.emoji).toBe('thumbs_up');
        expect(result.payload.userId).toBe('usr-1');
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'chat.message.reaction.removed',
          payload: {
            conversationId: 'conv-123',
          },
        })
      ).toThrow();
    });
  });

  describe('chat.conversation.role_changed', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.conversation.role_changed',
        payload: {
          conversationId: 'conv-123',
          userId: 'usr-1',
          oldRole: 'member',
          newRole: 'admin',
          changedBy: 'usr-owner',
          at: '2026-11-24T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.role_changed');
      if (result.type === 'chat.conversation.role_changed') {
        expect(result.payload.newRole).toBe('admin');
        expect(result.payload.changedBy).toBe('usr-owner');
      }
    });

    it('throws on invalid role', () => {
      expect(() =>
        parseEvent({
          type: 'chat.conversation.role_changed',
          payload: {
            conversationId: 'conv-123',
            userId: 'usr-1',
            oldRole: 'member',
            newRole: 'superadmin',
            changedBy: 'usr-owner',
            at: '2026-11-24T12:00:00.000Z',
          },
        })
      ).toThrow();
    });
  });

  describe('chat.conversation.invite_created', () => {
    it('succeeds on valid payload with optional fields', () => {
      const raw = {
        type: 'chat.conversation.invite_created',
        payload: {
          conversationId: 'conv-123',
          code: 'inv-abc',
          createdBy: 'usr-admin',
          expiresAt: '2026-11-25T12:00:00.000Z',
          maxUses: 10,
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.invite_created');
      if (result.type === 'chat.conversation.invite_created') {
        expect(result.payload.code).toBe('inv-abc');
        expect(result.payload.maxUses).toBe(10);
      }
    });

    it('succeeds on minimal payload (null/omitted optional fields)', () => {
      const raw = {
        type: 'chat.conversation.invite_created',
        payload: {
          conversationId: 'conv-123',
          code: 'inv-xyz',
          createdBy: 'usr-admin',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.invite_created');
    });
  });

  describe('chat.conversation.member_joined', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'chat.conversation.member_joined',
        payload: {
          conversationId: 'conv-123',
          userId: 'usr-2',
          joinedVia: 'invite',
          code: 'inv-abc',
          at: '2026-11-24T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('chat.conversation.member_joined');
      if (result.type === 'chat.conversation.member_joined') {
        expect(result.payload.code).toBe('inv-abc');
        expect(result.payload.joinedVia).toBe('invite');
      }
    });

    it('throws on invalid joinedVia', () => {
      expect(() =>
        parseEvent({
          type: 'chat.conversation.member_joined',
          payload: {
            conversationId: 'conv-123',
            userId: 'usr-2',
            joinedVia: 'direct_add',
            code: 'inv-abc',
            at: '2026-11-24T12:00:00.000Z',
          },
        })
      ).toThrow();
    });
  });

  describe('voice.call.group_started', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'voice.call.group_started',
        payload: {
          callId: 'call-grp-1',
          conversationId: 'conv-1',
          hostId: 'usr-host',
          roomName: 'room-grp-1',
          mode: 'video',
          startedAt: '2026-11-24T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('voice.call.group_started');
      if (result.type === 'voice.call.group_started') {
        expect(result.payload.callId).toBe('call-grp-1');
        expect(result.payload.mode).toBe('video');
      }
    });

    it('throws on invalid mode', () => {
      expect(() =>
        parseEvent({
          type: 'voice.call.group_started',
          payload: {
            callId: 'call-grp-1',
            conversationId: 'conv-1',
            hostId: 'usr-host',
            roomName: 'room-grp-1',
            mode: 'screen_only',
            startedAt: '2026-11-24T12:00:00.000Z',
          },
        })
      ).toThrow();
    });
  });

  describe('voice.call.participant_joined', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'voice.call.participant_joined',
        payload: {
          callId: 'call-grp-1',
          conversationId: 'conv-1',
          userId: 'usr-3',
          at: '2026-11-24T12:01:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('voice.call.participant_joined');
      if (result.type === 'voice.call.participant_joined') {
        expect(result.payload.userId).toBe('usr-3');
      }
    });
  });

  describe('voice.call.participant_left', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'voice.call.participant_left',
        payload: {
          callId: 'call-grp-1',
          conversationId: 'conv-1',
          userId: 'usr-3',
          at: '2026-11-24T12:05:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('voice.call.participant_left');
      if (result.type === 'voice.call.participant_left') {
        expect(result.payload.userId).toBe('usr-3');
      }
    });
  });

  describe('core.user.followed', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.user.followed',
        payload: {
          followerId: 'user-1',
          followingId: 'user-2',
          at: '2026-11-25T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.user.followed');
      if (result.type === 'core.user.followed') {
        expect(result.payload.followerId).toBe('user-1');
        expect(result.payload.followingId).toBe('user-2');
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'core.user.followed',
          payload: {
            followerId: 'user-1',
          },
        })
      ).toThrow();
    });
  });

  describe('core.user.unfollowed', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.user.unfollowed',
        payload: {
          followerId: 'user-1',
          followingId: 'user-2',
          at: '2026-11-25T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.user.unfollowed');
    });
  });

  describe('core.post.created', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.post.created',
        payload: {
          postId: 'post-123',
          authorId: 'user-1',
          body: 'Hello world post',
          hasImage: false,
          createdAt: '2026-11-25T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.post.created');
      if (result.type === 'core.post.created') {
        expect(result.payload.postId).toBe('post-123');
        expect(result.payload.hasImage).toBe(false);
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'core.post.created',
          payload: {
            postId: 'post-123',
          },
        })
      ).toThrow();
    });
  });

  describe('core.post.deleted', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.post.deleted',
        payload: {
          postId: 'post-123',
          authorId: 'user-1',
          at: '2026-11-25T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.post.deleted');
    });
  });

  describe('core.post.liked', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.post.liked',
        payload: {
          postId: 'post-123',
          authorId: 'user-1',
          userId: 'user-2',
          at: '2026-11-25T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.post.liked');
    });
  });

  describe('core.post.unliked', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.post.unliked',
        payload: {
          postId: 'post-123',
          authorId: 'user-1',
          userId: 'user-2',
          at: '2026-11-25T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.post.unliked');
    });
  });

  describe('core.comment.created', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.comment.created',
        payload: {
          commentId: 'c-1',
          postId: 'p-1',
          commentAuthorId: 'u-1',
          postAuthorId: 'u-2',
          body: 'Great post!',
          at: '2026-11-25T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.comment.created');
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'core.comment.created',
          payload: {
            commentId: 'c-1',
            postId: 'p-1',
          },
        })
      ).toThrow();
    });
  });

  describe('core.comment.deleted', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.comment.deleted',
        payload: {
          commentId: 'c-1',
          postId: 'p-1',
          commentAuthorId: 'u-1',
          at: '2026-11-25T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.comment.deleted');
    });
  });

  describe('core.post.edited', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.post.edited',
        payload: {
          postId: 'p-1',
          authorId: 'u-1',
          body: 'Updated body text',
          hasImage: false,
          at: '2026-11-25T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.post.edited');
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'core.post.edited',
          payload: {
            postId: 'p-1',
            authorId: 'u-1',
          },
        })
      ).toThrow();
    });
  });

  describe('core.report.created', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.report.created',
        payload: {
          reportId: 'rep_123',
          reporterId: 'usr_reporter',
          targetType: 'post',
          targetId: 'post_456',
          reason: 'spam',
          at: '2026-11-25T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.report.created');
      if (result.type === 'core.report.created') {
        expect(result.payload.reportId).toBe('rep_123');
        expect(result.payload.reason).toBe('spam');
      }
    });

    it('throws on missing required fields or invalid reason', () => {
      expect(() =>
        parseEvent({
          type: 'core.report.created',
          payload: {
            reportId: 'rep_123',
          },
        })
      ).toThrow();

      expect(() =>
        parseEvent({
          type: 'core.report.created',
          payload: {
            reportId: 'rep_123',
            reporterId: 'usr_reporter',
            targetType: 'invalid_type',
            targetId: 'post_456',
            reason: 'spam',
            at: '2026-11-25T12:00:00.000Z',
          },
        })
      ).toThrow();
    });
  });

  describe('core.report.resolved', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.report.resolved',
        payload: {
          reportId: 'rep_123',
          resolvedBy: 'usr_admin',
          action: 'delete_post',
          at: '2026-11-25T12:30:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.report.resolved');
      if (result.type === 'core.report.resolved') {
        expect(result.payload.action).toBe('delete_post');
      }
    });

    it('throws on invalid action', () => {
      expect(() =>
        parseEvent({
          type: 'core.report.resolved',
          payload: {
            reportId: 'rep_123',
            resolvedBy: 'usr_admin',
            action: 'invalid_action',
            at: '2026-11-25T12:30:00.000Z',
          },
        })
      ).toThrow();
    });
  });

  describe('core.user.banned', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.user.banned',
        payload: {
          userId: 'usr_bad',
          bannedBy: 'usr_admin',
          reason: 'Severe harassment',
          at: '2026-11-25T12:45:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.user.banned');
      if (result.type === 'core.user.banned') {
        expect(result.payload.userId).toBe('usr_bad');
        expect(result.payload.reason).toBe('Severe harassment');
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'core.user.banned',
          payload: {
            userId: 'usr_bad',
          },
        })
      ).toThrow();
    });
  });

  describe('core.user.unbanned', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.user.unbanned',
        payload: {
          userId: 'usr_bad',
          unbannedBy: 'usr_admin',
          at: '2026-11-25T13:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.user.unbanned');
      if (result.type === 'core.user.unbanned') {
        expect(result.payload.userId).toBe('usr_bad');
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'core.user.unbanned',
          payload: {
            userId: 'usr_bad',
          },
        })
      ).toThrow();
    });
  });

  describe('auth.session.revoked_device', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'auth.session.revoked_device',
        payload: {
          userId: 'usr_123',
          sessionId: 'sess_abc',
          reason: 'user_revoked_device',
          at: '2026-11-25T14:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('auth.session.revoked_device');
      if (result.type === 'auth.session.revoked_device') {
        expect(result.payload.userId).toBe('usr_123');
        expect(result.payload.sessionId).toBe('sess_abc');
        expect(result.payload.reason).toBe('user_revoked_device');
      }
    });

    it('throws on missing required fields', () => {
      expect(() =>
        parseEvent({
          type: 'auth.session.revoked_device',
          payload: {
            userId: 'usr_123',
            sessionId: 'sess_abc',
          },
        })
      ).toThrow();
    });

    it('throws on extra properties', () => {
      expect(() =>
        parseEvent({
          type: 'auth.session.revoked_device',
          payload: {
            userId: 'usr_123',
            sessionId: 'sess_abc',
            reason: 'logout',
            at: '2026-11-25T14:00:00.000Z',
            extra: 123,
          },
        })
      ).toThrow();
    });
  });

  describe('core.story.created', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.story.created',
        payload: {
          storyId: 'story_123',
          authorId: 'usr_1',
          mediaType: 'image',
          at: '2026-11-26T10:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.story.created');
      if (result.type === 'core.story.created') {
        expect(result.payload.storyId).toBe('story_123');
        expect(result.payload.mediaType).toBe('image');
      }
    });

    it('throws on invalid mediaType or missing fields', () => {
      expect(() =>
        parseEvent({
          type: 'core.story.created',
          payload: {
            storyId: 'story_123',
            authorId: 'usr_1',
            mediaType: 'audio',
            at: '2026-11-26T10:00:00.000Z',
          },
        })
      ).toThrow();
    });
  });

  describe('core.story.deleted', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.story.deleted',
        payload: {
          storyId: 'story_123',
          authorId: 'usr_1',
          at: '2026-11-26T10:05:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('core.story.deleted');
      if (result.type === 'core.story.deleted') {
        expect(result.payload.storyId).toBe('story_123');
      }
    });

    it('throws on extra properties', () => {
      expect(() =>
        parseEvent({
          type: 'core.story.deleted',
          payload: {
            storyId: 'story_123',
            authorId: 'usr_1',
            at: '2026-11-26T10:05:00.000Z',
            extra: true,
          },
        })
      ).toThrow();
    });
  });

  describe('core.reel.created', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.reel.created',
        payload: {
          reelId: 'reel_1',
          authorId: 'usr_1',
          at: '2026-11-26T10:00:00.000Z',
        },
      };
      const res = parseEvent(raw);
      expect(res.type).toBe('core.reel.created');
    });

    it('throws on missing fields', () => {
      expect(() => parseEvent({ type: 'core.reel.created', payload: { reelId: 'reel_1' } })).toThrow();
    });
  });

  describe('core.reel.liked', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.reel.liked',
        payload: {
          reelId: 'reel_1',
          authorId: 'usr_1',
          userId: 'usr_2',
          at: '2026-11-26T10:00:00.000Z',
        },
      };
      const res = parseEvent(raw);
      expect(res.type).toBe('core.reel.liked');
    });
  });

  describe('core.reel.unliked', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.reel.unliked',
        payload: {
          reelId: 'reel_1',
          authorId: 'usr_1',
          userId: 'usr_2',
          at: '2026-11-26T10:00:00.000Z',
        },
      };
      const res = parseEvent(raw);
      expect(res.type).toBe('core.reel.unliked');
    });
  });

  describe('core.reel.viewed', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'core.reel.viewed',
        payload: {
          reelId: 'reel_1',
          authorId: 'usr_1',
          viewCountBatch: 5,
          at: '2026-11-26T10:00:00.000Z',
        },
      };
      const res = parseEvent(raw);
      expect(res.type).toBe('core.reel.viewed');
    });

    it('throws on invalid viewCountBatch <= 0', () => {
      expect(() =>
        parseEvent({
          type: 'core.reel.viewed',
          payload: {
            reelId: 'reel_1',
            authorId: 'usr_1',
            viewCountBatch: 0,
            at: '2026-11-26T10:00:00.000Z',
          },
        })
      ).toThrow();
    });
  });

  describe('spaces.* events', () => {
    const at = '2026-11-26T12:00:00.000Z';

    it('validates all 11 spaces lifecycle, member, role, and channel events', () => {
      const validEvents = [
        { type: 'spaces.space.created', payload: { spaceId: 'sp1', ownerId: 'u1', name: 'Devs', at } },
        { type: 'spaces.space.updated', payload: { spaceId: 'sp1', by: 'u1', at } },
        { type: 'spaces.space.deleted', payload: { spaceId: 'sp1', by: 'u1', at } },
        { type: 'spaces.member.added', payload: { spaceId: 'sp1', userId: 'u2', addedBy: 'u1', at } },
        { type: 'spaces.member.removed', payload: { spaceId: 'sp1', userId: 'u2', removedBy: 'u1', at } },
        { type: 'spaces.role.changed', payload: { spaceId: 'sp1', roleId: 'r1', by: 'u1', at } },
        { type: 'spaces.member.roles.changed', payload: { spaceId: 'sp1', userId: 'u2', by: 'u1', at } },
        { type: 'spaces.channel.created', payload: { spaceId: 'sp1', channelId: 'ch1', kind: 'text', name: 'general', at } },
        { type: 'spaces.channel.updated', payload: { spaceId: 'sp1', channelId: 'ch1', by: 'u1', at } },
        { type: 'spaces.channel.deleted', payload: { spaceId: 'sp1', channelId: 'ch1', by: 'u1', at } },
        { type: 'spaces.channel.permissions.changed', payload: { spaceId: 'sp1', channelId: 'ch1', by: 'u1', at } },
      ];

      for (const evt of validEvents) {
        const parsed = parseEvent(evt);
        expect(parsed.type).toBe(evt.type);
      }
    });

    it('throws on invalid spaces.channel.created kind or extra properties', () => {
      expect(() =>
        parseEvent({
          type: 'spaces.channel.created',
          payload: { spaceId: 'sp1', channelId: 'ch1', kind: 'video', name: 'cam', at },
        })
      ).toThrow();
      expect(() =>
        parseEvent({
          type: 'spaces.space.updated',
          payload: { spaceId: 'sp1', by: 'u1', at, extra: 1 },
        })
      ).toThrow();
    });
  });

  describe('core.comment.* V4-1 events', () => {
    it('validates core.comment.replied, core.comment.liked, and core.comment.unliked', () => {
      const replied = parseEvent({
        type: 'core.comment.replied',
        payload: {
          commentId: 'c_2',
          parentCommentId: 'c_1',
          postId: 'p_1',
          commentAuthorId: 'usr_2',
          parentAuthorId: 'usr_1',
          at: '2026-11-27T10:00:00.000Z',
        },
      });
      expect(replied.type).toBe('core.comment.replied');

      const liked = parseEvent({
        type: 'core.comment.liked',
        payload: {
          commentId: 'c_1',
          postId: 'p_1',
          userId: 'usr_2',
          commentAuthorId: 'usr_1',
          at: '2026-11-27T10:00:00.000Z',
        },
      });
      expect(liked.type).toBe('core.comment.liked');

      const unliked = parseEvent({
        type: 'core.comment.unliked',
        payload: {
          commentId: 'c_1',
          postId: 'p_1',
          userId: 'usr_2',
          commentAuthorId: 'usr_1',
          at: '2026-11-27T10:00:00.000Z',
        },
      });
      expect(unliked.type).toBe('core.comment.unliked');
    });

    it('rejects extra fields or missing required fields on V4-1 comment events', () => {
      expect(() =>
        parseEvent({
          type: 'core.comment.replied',
          payload: {
            commentId: 'c_2',
            parentCommentId: 'c_1',
            postId: 'p_1',
            commentAuthorId: 'usr_2',
            parentAuthorId: 'usr_1',
            at: '2026-11-27T10:00:00.000Z',
            extra: true,
          },
        })
      ).toThrow();
      expect(() =>
        parseEvent({
          type: 'core.comment.liked',
          payload: {
            commentId: 'c_1',
            postId: 'p_1',
            userId: 'usr_2',
          },
        })
      ).toThrow();
    });
  });

  describe('core.* V4-2 advanced comment, mention, and hashtag events', () => {
    const at = '2026-11-27T12:00:00.000Z';

    it('validates core.comment.updated, core.comment.pinned, core.comment.unpinned, core.user.mentioned, core.hashtag.created', () => {
      expect(
        parseEvent({
          type: 'core.comment.updated',
          payload: { commentId: 'c1', postId: 'p1', body: 'Edited body', editedAt: at },
        }).type
      ).toBe('core.comment.updated');

      expect(
        parseEvent({
          type: 'core.comment.pinned',
          payload: { commentId: 'c1', postId: 'p1', by: 'u1', at },
        }).type
      ).toBe('core.comment.pinned');

      expect(
        parseEvent({
          type: 'core.comment.unpinned',
          payload: { commentId: 'c1', postId: 'p1', by: 'u1', at },
        }).type
      ).toBe('core.comment.unpinned');

      expect(
        parseEvent({
          type: 'core.user.mentioned',
          payload: {
            userId: 'u2',
            byUserId: 'u1',
            contentType: 'comment',
            contentId: 'c1',
            context: 'Hey @bob',
            at,
          },
        }).type
      ).toBe('core.user.mentioned');

      expect(
        parseEvent({
          type: 'core.hashtag.created',
          payload: { tag: 'nebron', postId: 'p1', at },
        }).type
      ).toBe('core.hashtag.created');
    });

    it('rejects invalid contentType or extra properties on V4-2 events', () => {
      expect(() =>
        parseEvent({
          type: 'core.user.mentioned',
          payload: {
            userId: 'u2',
            byUserId: 'u1',
            contentType: 'invalid_type',
            contentId: 'c1',
            context: 'Hi',
            at,
          },
        })
      ).toThrow();
      expect(() =>
        parseEvent({
          type: 'core.hashtag.created',
          payload: { tag: 'nebron', postId: 'p1', at, extra: 1 },
        })
      ).toThrow();
    });
  });

  describe('V4-3 saves and share events', () => {
    const at = '2026-11-27T12:00:00.000Z';

    it('accepts core.{post,reel,comment}.{saved,unsaved} and core.content.shared payloads', () => {
      expect(
        parseEvent({
          type: 'core.post.saved',
          payload: { postId: 'p1', userId: 'u1', at },
        }).type
      ).toBe('core.post.saved');

      expect(
        parseEvent({
          type: 'core.post.unsaved',
          payload: { postId: 'p1', userId: 'u1', at },
        }).type
      ).toBe('core.post.unsaved');

      expect(
        parseEvent({
          type: 'core.reel.saved',
          payload: { reelId: 'r1', userId: 'u1', at },
        }).type
      ).toBe('core.reel.saved');

      expect(
        parseEvent({
          type: 'core.reel.unsaved',
          payload: { reelId: 'r1', userId: 'u1', at },
        }).type
      ).toBe('core.reel.unsaved');

      expect(
        parseEvent({
          type: 'core.comment.saved',
          payload: { commentId: 'c1', userId: 'u1', at },
        }).type
      ).toBe('core.comment.saved');

      expect(
        parseEvent({
          type: 'core.comment.unsaved',
          payload: { commentId: 'c1', userId: 'u1', at },
        }).type
      ).toBe('core.comment.unsaved');

      expect(
        parseEvent({
          type: 'core.content.shared',
          payload: { contentType: 'post', contentId: 'p1', byUserId: 'u1', at },
        }).type
      ).toBe('core.content.shared');

      expect(
        parseEvent({
          type: 'core.post.updated',
          payload: { postId: 'p1', body: 'Updated #news', hashtags: ['news'], editedAt: at },
        }).type
      ).toBe('core.post.updated');

      expect(
        parseEvent({
          type: 'core.comment.reaction.added',
          payload: { commentId: 'c1', postId: 'p1', emoji: 'heart', userId: 'u1', at },
        }).type
      ).toBe('core.comment.reaction.added');

      expect(
        parseEvent({
          type: 'core.comment.reaction.removed',
          payload: { commentId: 'c1', postId: 'p1', emoji: 'heart', userId: 'u1', at },
        }).type
      ).toBe('core.comment.reaction.removed');
    });

    it('rejects invalid contentType or extra properties on V4-3 events', () => {
      expect(() =>
        parseEvent({
          type: 'core.content.shared',
          payload: { contentType: 'story', contentId: 's1', byUserId: 'u1', at },
        })
      ).toThrow();

      expect(() =>
        parseEvent({
          type: 'core.post.saved',
          payload: { postId: 'p1', userId: 'u1', at, extra: true },
        })
      ).toThrow();
    });
  });

  describe('unknown and invalid events', () => {
    it('throws on unknown.event', () => {
      expect(() =>
        parseEvent({
          type: 'unknown.event',
          payload: {},
        })
      ).toThrow();
    });

    it('throws on non-object inputs', () => {
      expect(() => parseEvent(null)).toThrow();
      expect(() => parseEvent(undefined)).toThrow();
      expect(() => parseEvent('not an object')).toThrow();
      expect(() => parseEvent(42)).toThrow();
    });

    it('safeParseEvent returns success: false for invalid events', () => {
      const result = safeParseEvent({ type: 'unknown.event', payload: {} });
      expect(result.success).toBe(false);
    });
  });
});
