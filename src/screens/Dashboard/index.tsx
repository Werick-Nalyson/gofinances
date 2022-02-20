import React, { useCallback, useEffect, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

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

export function Dashboard () {
    const [data, setData] = useState<DataListProps[]>([])

    async function loadTransaction () {
        try {
            const dataKey = "@gofinances:transactions"

            const response = await AsyncStorage.getItem(dataKey)

            const transactions = response ? JSON.parse(response) : []

            const transactionFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
                console.log(item)
                const amount = Number(item.amount).toLocaleString('pt-BR', {
                    style: "currency",
                    currency: "BRL"
                })

                const dateFormatted = Intl.DateTimeFormat('pt-BR', {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                }).format(new Date(item.date))

                return {
                    ...item,
                    amount,
                    date: dateFormatted
                }
            })

            setData(transactionFormatted)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        loadTransaction()
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransaction()
    }, []))

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