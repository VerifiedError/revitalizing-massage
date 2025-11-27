import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import styles from './layout.module.css';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Check if user has admin role
  const role = user.publicMetadata?.role as string | undefined;

  if (role !== 'admin') {
    redirect('/?error=unauthorized');
  }

  // Extract only serializable user data
  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddresses: user.emailAddresses.map(email => ({
      emailAddress: email.emailAddress
    }))
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar user={userData} />
      <main className={styles.adminMain}>
        {children}
      </main>
    </div>
  );
}
