import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import Loader from "@/components/ui/preloader";
import { collection, getDocs } from "firebase/firestore";
import Layout from "@/components/Layout";
import HomeContainer from "@/components/container/homeContainer";

interface allUserData {
  creationTime: string;
  displayName: string;
  email: string;
  emailIsVerified: boolean;
  hasPremium: boolean;
  lastSignIn: string;
  phoneNumber: number;
  photoUrl: string;
  userId: string;
}

const Index = () => {
  const [myUsers, setMyUsers] = useState<allUserData[]>([]);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const getAllUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const documents = querySnapshot.docs.map((doc) => ({
        displayName: doc.data().displayName,
        creationTime: doc.data().creationTime,
        email: doc.data().email,
        emailIsVerified: doc.data().emailIsVerified,
        hasPremium: doc.data().hasPremium,
        lastSignIn: doc.data().lastSignIn,
        phoneNumber: doc.data().phoneNumber,
        photoUrl: doc.data().photoUrl,
        userId: doc.data().userId,
      }));
      setMyUsers(documents);
    };
    getAllUsers();
  }, []);

  if (loading) {
    return <Loader text="Your SportPals Is Loading" />;
  }
  if (!user) {
    return <Loader text="logging you out" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
      <Layout>
        <HomeContainer />
      </Layout>
  );
};

export default Index;
