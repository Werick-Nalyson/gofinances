import React from 'react'

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
    HighlightCards,
    TransactionsList,
    Transactions,
    Title,
} from './styles'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

const data: DataListProps[] = [
    {
        id: '1',
        type: 'positive',
        title: "Desenvolvimento de site",
        amount: "R$ 12.000,00",
        category: {
            name: 'Vendas',
            icon: 'dollar-sign'
        },
        date: "13/04/2022"
    },
    {
        id: '2',
        type: 'negative',
        title: "Hamburger Pizzy",
        amount: "R$ 59,00",
        category: {
            name: 'Alimentação',
            icon: 'coffee'
        },
        date: "13/04/2022"
    },
    {
        id: '3',
        type: 'negative',
        title: "Aluguel do apartamento",
        amount: "R$ 1.200,00",
        category: {
            name: 'Casa',
            icon: 'shopping-bag'
        },
        date: "13/04/2022"
    }
]

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

            <Transactions>
                <Title>Listagem</Title>

                <TransactionsList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />
            </Transactions>
        </Container>
    )
}