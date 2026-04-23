import { z } from 'zod';

export const onboardingSchema = z.object({
  bio: z.string().max(280).optional(),
  city: z.string().min(2),
  levelGlobal: z.coerce.number().int().min(1).max(5),
  preferredMindset: z.enum(['competitive', 'casual', 'discovery']),
  availabilityNotes: z.string().max(500).optional()
});

export const createGroupSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  sportId: z.string().optional()
});

export const createMatchSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  sportId: z.string(),
  mindset: z.enum(['competitive', 'casual', 'discovery']),
  levelMin: z.coerce.number().int().min(1).max(5).optional(),
  levelMax: z.coerce.number().int().min(1).max(5).optional(),
  locationName: z.string().min(2),
  locationAddress: z.string().min(5),
  startAt: z.string(),
  endAt: z.string(),
  maxPlayers: z.coerce.number().int().min(2).max(50),
  groupId: z.string().optional()
});

export const createExpenseSchema = z.object({
  matchId: z.string(),
  label: z.string().min(2),
  amount: z.coerce.number().positive(),
  currency: z.string().length(3),
  participantIds: z.array(z.string()).min(1)
});
