import { describe, expect, it } from 'vitest'
import { cleanString, isUuid, validEmail } from '@/lib/validation'
describe('public input validation',()=>{
 it('normalizes valid email addresses',()=>expect(validEmail('  HIKER@Example.CA ')).toBe('hiker@example.ca'))
 it('rejects malformed email addresses',()=>expect(validEmail('not-an-email')).toBeNull())
 it('trims and limits submitted text',()=>expect(cleanString('  adventure  ',5)).toBe('adven'))
 it('accepts supported UUIDs',()=>expect(isUuid('123e4567-e89b-42d3-a456-426614174000')).toBe(true))
 it('rejects arbitrary identifiers',()=>expect(isUuid('../gear-room')).toBe(false))
})
