/* eslint-disable jest/no-hooks */
/**
 * @jest-environment jsdom
 */

import { onRenderBody } from '../gatsby-ssr'

describe('gatsby-plugin-google-analytics', () => {
  describe('gatsby-ssr', () => {
    describe('onRenderBody', () => {
      describe('in non-production env', () => {
        it('does not set tracking script', () => {
          expect.hasAssertions()
          const setHeadComponents = jest.fn()
          onRenderBody({ setHeadComponents })
          expect(setHeadComponents).not.toHaveBeenCalled()
        })
      })

      describe('in production env', () => {
        let env

        beforeAll(() => {
          env = process.env.NODE_ENV
          process.env.NODE_ENV = 'production'
        })

        afterAll(() => {
          process.env.NODE_ENV = env
        })

        const setup = (options) => {
          const setHeadComponents = jest.fn()
          const setPostBodyComponents = jest.fn()

          options = Object.assign(
            {
              siteId: 'TEST_SITE_ID',
              matomoUrl: 'TEST_MATOMO_URL',
              siteUrl: 'TEST_SITE_URL'
            },
            options
          )

          onRenderBody({ setHeadComponents, setPostBodyComponents }, options)

          return {
            setHeadComponents,
            setPostBodyComponents
          }
        }

        it('sets tracking script', () => {
          expect.hasAssertions()
          const { setHeadComponents, setPostBodyComponents } = setup()

          expect(setHeadComponents).toHaveBeenCalledTimes(1)
          expect(setPostBodyComponents).toHaveBeenCalledTimes(1)
        })

        it('sets siteId', () => {
          expect.hasAssertions()
          const { setPostBodyComponents } = setup()
          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])
          expect(result).toMatch(/TEST_SITE_ID/)
        })

        it('sets matomoUrl', () => {
          expect.hasAssertions()
          const { setPostBodyComponents } = setup()
          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])
          expect(result).toMatch(/TEST_MATOMO_URL/)
        })

        it('sets siteUrl', () => {
          expect.hasAssertions()
          const { setPostBodyComponents } = setup()
          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])
          expect(result).toMatch(/TEST_SITE_URL/)
        })

        it('sets requireConsent', () => {
          expect.hasAssertions()
          const { setPostBodyComponents } = setup({
            requireConsent: true
          })
          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])
          expect(result).toMatch(/requireConsent/)
        })

        it('sets requireCookieConsent', () => {
          expect.hasAssertions()
          const { setPostBodyComponents } = setup({
            requireCookieConsent: true
          })
          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])
          expect(result).toMatch(/requireCookieConsent/)
        })

        it('sets disableCookies', () => {
          expect.hasAssertions()
          const { setPostBodyComponents } = setup({
            disableCookies: true
          })
          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])
          expect(result).toMatch(/disableCookies/)
        })

        it('sets enableJSErrorTracking', () => {
          expect.hasAssertions()
          const { setPostBodyComponents } = setup({
            enableJSErrorTracking: true
          })
          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])
          expect(result).toMatch(/enableJSErrorTracking/)
        })

        it('sets localScript', () => {
          expect.hasAssertions()
          const { setPostBodyComponents } = setup({
            localScript: 'TEST_LOCAL_SCRIPT'
          })
          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])
          expect(result).toMatch(/TEST_LOCAL_SCRIPT/)
        })

        it('sets respectDnt to false', () => {
          expect.hasAssertions()
          const { setPostBodyComponents } = setup({
            respectDnt: false
          })
          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])
          expect(result).not.toMatch(/navigator.doNotTrack/)
        })
      })
    })
  })
})
