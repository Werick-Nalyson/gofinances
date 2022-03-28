import React, { createContext, useContext, useState } from 'react'
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
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string
}

const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = process.env

const AuthContext = createContext({} as AuthContextData)

function AuthProvider ({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User)

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
                    photo: userInfo.picture
                }

                console.log(userLogged)

                setUser(userLogged)
                await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
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
                const userLogged = {
                    id: String(userInfo.user),
                    email: userInfo.email!,
                    name: userInfo.fullName!.givenName!,
                    photo: undefined
                }

                console.log(userLogged)

                setUser(userLogged)
                await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
            }
        } catch (err: any) {
            throw new Error(err)
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            signInWithApple
        }}>
            {children}
        </AuthContext.Provider>
    )
} 

const useContextAuth = () => {
    return useContext(AuthContext)
}

export { AuthProvider, useContextAuth }