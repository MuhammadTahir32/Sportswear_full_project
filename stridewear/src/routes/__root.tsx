import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HeadContent, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'

import { AuthProvider } from '../lib/auth'
import { Header } from '../components/layout/header'
import appCss from '../styles.css?url'

const queryClient = new QueryClient()

const AUTH_ROUTES = ['/signin', '/signup', '/forgot-password', '/reset-password', '/auth/confirm']

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const showHeader = !AUTH_ROUTES.includes(currentPath)

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {showHeader && <Header />}
            {children}
          </AuthProvider>
        </QueryClientProvider>

        <Scripts />
      </body>
    </html>
  )
}
