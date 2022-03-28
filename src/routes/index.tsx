import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { AppRoutes } from './app.routes'
import { AuthRoutes } from './auth.routes'
import { useContextAuth } from '../contexts/AuthContext'


export function Routes () {
    const { user } = useContextAuth()

    return (
        <NavigationContainer>
            {user.id ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
    )
}