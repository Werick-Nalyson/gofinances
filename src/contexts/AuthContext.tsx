import React, { createContext, useContext } from 'react'

interface AuthProviderProps {
    children: React.ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthContextData {
    user: User;
}

const AuthContext = createContext({} as AuthContextData)

function AuthProvider ({ children }: AuthProviderProps) {
    const user: User = {
        id: '213123asd12d12d1',
        name: 'Conta teste',
        email: 'teste@teste.com.br'
    }

    return (
        <AuthContext.Provider value={{
            user,
        }}>
            {children}
        </AuthContext.Provider>
    )
} 

const useContextAuth = () => {
    return useContext(AuthContext)
}

export { AuthProvider, useContextAuth }