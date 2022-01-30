import React from 'react'
import { Feather } from '@expo/vector-icons'

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGretting,
    UserName,
    Icon
} from './styles'

export function Dashboard () {
    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo
                            source={{ uri: 'https://media-exp1.licdn.com/dms/image/C4E03AQHuFwvjCgyr9w/profile-displayphoto-shrink_800_800/0/1599278928625?e=1649289600&v=beta&t=UHm5GEDcYLYTreKBtC5WgEVADuAf5At-Tno80FFMiqc' }}
                        />

                        <User>
                            <UserGretting>Olá, </UserGretting>
                            <UserName>Werick</UserName>
                        </User>
                    </UserInfo>
                    
                    <Icon name="power" />
                </UserWrapper>
            </Header>
        </Container>
    )
}