import React, { createContext, useContext, useEffect, useState } from 'react'
import * as AuthSession from 'expo-auth-session'
import * as AppleAuthentication from 'expo-apple-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthProviderProps {
    children: React.ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string | undefined;
}

interface AuthContextData {
    user: User;
    userStorageLoading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    signOut: () => Promise<void>;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string
}

const { GOOGLE_CLIENT_ID } = process.env
const { GOOGLE_REDIRECT_URI } = process.env

const AuthContext = createContext({} as AuthContextData)

function AuthProvider ({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User)
    const [userStorageLoading, setUserStorageLoading] = useState(true)

    const userStorageKey = '@gofinances:user'

    useEffect(() => {
        async function loadUserStorageData () {
            const userStorage = await AsyncStorage.getItem(userStorageKey)
            
            if (userStorage) {
                const userLogged = JSON.parse(userStorage) as User;
                setUser(userLogged)
            }

            setUserStorageLoading(false)
        }

        loadUserStorageData()
    }, [])

    async function signInWithGoogle () {
        try {
            const CLIENT_ID = GOOGLE_CLIENT_ID;
            const REDIRECT_URI = encodeURI(String(GOOGLE_REDIRECT_URI));
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`

            const { type, params } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

            if (type === 'success') {
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)

                const userInfo = await response.json()

                const userLogged = {
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.given_name,
                    photo: userInfo.picture || `https://ui-avatars.com/api/?name=${userInfo.given_name}&length=1`
                }

                console.log(userLogged)

                setUser(userLogged)
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
            }
        } catch(err: any) {
            throw new Error(err)
        }
    }

    async function signInWithApple () {
        try {
            const userInfo = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
            })

            if (userInfo) {
                const name = userInfo.fullName!.givenName!

                const userLogged = {
                    id: String(userInfo.user),
                    email: userInfo.email!,
                    name,
                    photo: `https://ui-avatars.com/api/?name=${name}&length=1`
                }

                console.log(userLogged)

                setUser(userLogged)
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
            }
        } catch (err: any) {
            throw new Error(err)
        }
    }

    async function signOut () {
        console.log("signOut")
        setUser({} as User)
        await AsyncStorage.removeItem(userStorageKey)
    }

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            signInWithApple,
            signOut,
            userStorageLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
} 

const useContextAuth = () => {
    return useContext(AuthContext)
}

export { AuthProvider, useContextAuth }