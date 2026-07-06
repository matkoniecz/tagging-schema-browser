import { describe, expect, it } from 'vitest'
import { schemaFetchNeedsCorsProxy } from './schemaFetch'

describe('schemaFetchNeedsCorsProxy', () => {
  it('requires proxy for Netlify PR preview hosts', () => {
    expect(
      schemaFetchNeedsCorsProxy('https://deploy-preview-123--id-tagging-schema.netlify.app/dist/'),
    ).toBe(true)
  })

  it('does not require proxy for GitHub Pages interim dist', () => {
    expect(
      schemaFetchNeedsCorsProxy(
        'https://openstreetmap.github.io/id-tagging-schema/dist/presets.min.json',
      ),
    ).toBe(false)
  })

  it('does not require proxy for jsDelivr release dist', () => {
    expect(
      schemaFetchNeedsCorsProxy(
        'https://cdn.jsdelivr.net/npm/@openstreetmap/id-tagging-schema@latest/dist/presets.min.json',
      ),
    ).toBe(false)
  })
})
