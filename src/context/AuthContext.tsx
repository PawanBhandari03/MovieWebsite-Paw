import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { auth } from '../lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification
} from 'firebase/auth';

export interface User {
    name: string;
    username: string;
    email: string;
    bio?: string;
    emailVerified: boolean;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    login: (user: User, password?: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (user: User, password?: string) => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
    resendVerificationEmail: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    name: firebaseUser.displayName || '',
                    username: '', // Firebase doesn't have username by default
                    email: firebaseUser.email || '',
                    emailVerified: firebaseUser.emailVerified,
                    bio: '' // We would need Firestore to persist bio properly
                });
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (userData: User, password?: string) => {
        if (!password) throw new Error("Password required");
        const userCredential = await signInWithEmailAndPassword(auth, userData.email, password);

        if (!userCredential.user.emailVerified) {
            await signOut(auth);
            alert("Please verify your email first");
            throw new Error("Please verify your email first");
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const register = async (userData: User, password?: string) => {
        if (!password) throw new Error("Password required");
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);

        await updateProfile(userCredential.user, {
            displayName: userData.name
        });

        await sendEmailVerification(userCredential.user);
        await signOut(auth);
    };

    const updateUser = async (data: Partial<User>) => {
        if (auth.currentUser) {
            if (data.name) {
                await updateProfile(auth.currentUser, {
                    displayName: data.name
                });
            }
            // Note: Bio update would require Firestore, for now we just update local state if we were using it
            // But since onAuthStateChanged is the source of truth, we rely on that.
            // For this prototype, we'll just update the local user object to reflect changes in UI
            setUser(prev => prev ? { ...prev, ...data } : null);
        }
    };

    const resendVerificationEmail = async () => {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
        }
    };

    const deleteAccount = async () => {
        if (auth.currentUser) {
            try {
                await auth.currentUser.delete();
                localStorage.removeItem('userLists'); // Clear local data
                setUser(null);
                setIsLoggedIn(false);
            } catch (error: any) {
                if (error.code === 'auth/requires-recent-login') {
                    throw new Error("Security check: Please log out and log back in to delete your account.");
                }
                throw error;
            }
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout, register, updateUser, resendVerificationEmail, deleteAccount }}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen bg-black text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
