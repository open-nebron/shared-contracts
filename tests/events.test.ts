import { describe, it, expect } from 'vitest';
import {
  parseEvent,
  safeParseEvent,
  AuthUserRegisteredSchema,
  AuthSessionRevokedSchema,
  CoreProfileUpdatedSchema,
  VoiceCallRingingSchema,
  type ZenuxsEvent,
} from '../src/events.js';

describe('Event Schemas and parseEvent', () => {
  describe('auth.user.registered', () => {
    it('succeeds on valid payload', () => {
      const raw = {
        type: 'auth.user.registered',
        payload: {
          userId: 'usr_123',
          email: 'test@zenuxs.io',
          createdAt: '2026-11-17T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('auth.user.registered');
      expect(result.payload.userId).toBe('usr_123');
      expect(result.payload.email).toBe('test@zenuxs.io');
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
            email: 'test@zenuxs.io',
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
            email: 'test@zenuxs.io',
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
          fromUserId: 'usr_1',
          toUserId: 'usr_2',
          startedAt: '2026-11-17T12:00:00.000Z',
        },
      };

      const result = parseEvent(raw);
      expect(result.type).toBe('voice.call.ringing');
      if (result.type === 'voice.call.ringing') {
        expect(result.payload.callId).toBe('call_999');
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
