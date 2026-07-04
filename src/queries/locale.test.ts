import { afterEach, describe, expect, it, vi } from 'vitest'
import { discoverLocales } from './locale'

describe('discoverLocales', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses jsDelivr API for release dist without fetching locales.json', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (input: RequestInfo | URL) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
        if (url.includes('/resolved?')) {
          return new Response(JSON.stringify({ version: '6.18.0' }), { status: 200 })
        }
        return new Response(
          JSON.stringify({
            files: [
              {
                type: 'directory',
                name: 'dist',
                files: [
                  {
                    type: 'directory',
                    name: 'translations',
                    files: [
                      { type: 'file', name: 'de.min.json' },
                      { type: 'file', name: 'fr.min.json' },
                    ],
                  },
                ],
              },
            ],
          }),
          { status: 200 },
        )
      })

    const locales = await discoverLocales(
      'https://cdn.jsdelivr.net/npm/@openstreetmap/id-tagging-schema@latest/dist/',
    )

    expect(locales).toEqual(['de', 'fr'])
    expect(fetchMock).not.toHaveBeenCalledWith(expect.stringContaining('translations/locales.json'))
  })

  it('returns fallback locales for Netlify staging without fetching locales.json', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    const locales = await discoverLocales('https://ideditor.netlify.app/id-tagging-schema/dist/')

    expect(locales.length).toBeGreaterThan(10)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
