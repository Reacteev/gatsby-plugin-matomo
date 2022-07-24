/* eslint-disable jest/no-hooks */
/**
 * @jest-environment jsdom
 */

import { onRouteUpdate } from '../gatsby-browser'

jest.useFakeTimers()

describe('gatsby-plugin-matomo', () => {
  describe('gatsby-browser', () => {
    beforeEach(() => {
      jest.spyOn(global, 'setTimeout')
      window._paq = { push: jest.fn() }
    })

    afterEach(() => {
      jest.clearAllTimers()
    })

    describe('onRouteUpdate', () => {
      describe('in non-production env', () => {
        beforeAll(() => {
          window._paq = { push: jest.fn() }
        })

        it('does not send page view', () => {
          expect.hasAssertions()
          onRouteUpdate({}, {})
          expect(window._paq.push).not.toHaveBeenCalled()
        })

        it('sends page view in dev mode', () => {
          expect.hasAssertions()
          window.dev = true
          onRouteUpdate({}, {})
          expect(window._paq.push).toHaveBeenCalledTimes(1)
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

        // eslint-disable-next-line jest/no-commented-out-tests
        // it('does not send page view when _paq is undefined', () => {
        //   delete window._paq
        //   onRouteUpdate({}, {})
        //   // jest.runOnlyPendingTimers()
        //   expect(setTimeout).not.toHaveBeenCalled()
        // })

        it('sends page view', () => {
          expect.hasAssertions()
          onRouteUpdate({}, {})
          jest.runAllTimers()
          expect(window._paq.push).toHaveBeenCalledTimes(5)
        })

        it('uses setTimeout with a minimum delay of 32ms', () => {
          expect.hasAssertions()
          onRouteUpdate({}, {})
          jest.runOnlyPendingTimers()
          expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 32)
          expect(window._paq.push).toHaveBeenCalledTimes(5)
        })
      })
    })
  })
})
