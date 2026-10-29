import ScaleWrapper from '../components/ui/ScaleWrapper.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import { I18nProvider } from './i18n.jsx'
import AppRoutes from './router.jsx'

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <ScaleWrapper>
          <AppRoutes />
        </ScaleWrapper>
      </AuthProvider>
    </I18nProvider>
  )
}
