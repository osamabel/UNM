import { describe, expect, it } from 'vitest';
import { DEFAULT_FACULTY_ICON, iconForFacultySlug } from './faculty-icons';

describe('iconForFacultySlug', () => {
  it('returns faculty-specific icons', () => {
    expect(iconForFacultySlug('business-school')).toBe('briefcase');
    expect(iconForFacultySlug('school-of-technology')).toBe('cpu');
  });

  it('falls back to default for unknown or empty slugs', () => {
    expect(iconForFacultySlug('unknown')).toBe(DEFAULT_FACULTY_ICON);
    expect(iconForFacultySlug(null)).toBe(DEFAULT_FACULTY_ICON);
  });
});
