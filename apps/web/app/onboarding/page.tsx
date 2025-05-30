import { getUserDetails } from '@/actions/server/auth';

export default async function OnboardingPage() {
  const userDetails = await getUserDetails();
  return (
    <div>
      <h1>Onboarding</h1>
      <p>{userDetails?.email}</p>
      <p>{userDetails?.fullname}</p>
      <p>{userDetails?.phone}</p>
      <p>{userDetails?.address}</p>
      <p>{userDetails?.city}</p>
      <p>{userDetails?.state}</p>
      <p>{userDetails?.zip}</p>
    </div>
  );
}
