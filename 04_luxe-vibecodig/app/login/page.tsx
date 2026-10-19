import AuthPageShell from '@/components/auth/AuthPageShell';
import AuthScreen from '@/components/auth/AuthScreen';

export default function LoginPage() {
  return (
    <AuthPageShell>
      <AuthScreen mode="login" />
    </AuthPageShell>
  );
}
