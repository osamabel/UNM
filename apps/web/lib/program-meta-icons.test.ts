import { describe, expect, it } from 'vitest';
import { iconForProgramFormat, iconForProgramType } from './program-meta-icons';

describe('iconForProgramFormat', () => {
  it('maps distanciel and online formats to laptop', () => {
    expect(iconForProgramFormat('Distanciel')).toBe('laptop');
    expect(iconForProgramFormat('Online')).toBe('laptop');
  });

  it('maps hybrid formats to layers', () => {
    expect(iconForProgramFormat('Hybride')).toBe('layers');
  });

  it('maps on-campus formats to building', () => {
    expect(iconForProgramFormat('Présentiel')).toBe('building');
    expect(iconForProgramFormat('On-site')).toBe('building');
  });
});

describe('iconForProgramType', () => {
  it('maps programme types to semantic icons', () => {
    expect(iconForProgramType('MBA')).toBe('briefcase');
    expect(iconForProgramType('DBA')).toBe('award');
    expect(iconForProgramType('Bachelor')).toBe('graduation');
    expect(iconForProgramType('Certificate')).toBe('badge');
  });
});
