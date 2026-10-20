import AuthPageShell from '@/components/auth/AuthPageShell';
import AuthScreen from '@/components/auth/AuthScreen';

export default function SignupPage() {
  return (
    <AuthPageShell>
      <AuthScreen mode="signup" />
    </AuthPageShell>
  );
}
