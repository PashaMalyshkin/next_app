import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../routers/_app';

export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    /* [...] */
  }, 
  ssr: true,
  responseMeta(opts) {
    const { clientErrors } = opts;
    if (clientErrors.length) {
      // propagate first http error from API calls
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      };
    }
    // cache full page for 1 day + revalidate once every second
    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
    return {
      'Cache-Control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
    };
  },
});