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
    Icon,
    HighlightCards
} from './styles'

import { HighlightCard } from '../../components/HighlightCard'

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

            <HighlightCards>
                <HighlightCard
                    type="up"
                    title="Entradas"
                    amount="R$ 17.400,00"
                    lastTransaction="Última entrada dia 13 de abril"
                />
                <HighlightCard
                    type="down"
                    title="Saídas"
                    amount="R$ 1.259,00"
                    lastTransaction="Última saída dia 03 de abril"
                />
                <HighlightCard
                    type="total"
                    title="Total"
                    amount="R$ 16.141,00"
                    lastTransaction="01 à 15 de abril"
                />
            </HighlightCards>
        </Container>
    )
}