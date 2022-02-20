import React, { useCallback, useEffect, useState } from 'react'

import { ActivityIndicator } from 'react-native'

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
    LoadContainer
} from './styles'

import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'
import { useTheme } from 'styled-components'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
}

interface LastTransactionDateType {
    lastTransactionFormatted: string;
    timestamp: number;
}

export function Dashboard () {
    const [isLoading, setIsLoading] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([])
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

    const theme = useTheme()

    function getLastTransactionDate (collection: DataListProps[], type: 'positive' | 'negative'): LastTransactionDateType {
        const lastTransactions = collection
            .filter((transaction) => transaction.type === type)
            .map((transaction) => new Date(transaction.date).getTime())

        if (lastTransactions.length === 0) return {
            timestamp: 0,
            lastTransactionFormatted: ""
        }

        const last = Math.max.apply(Math, lastTransactions)

        const lastTransactionFormatted = Intl.DateTimeFormat('pt-BR', {
            day: "2-digit",
            month: "long",
        }).format(new Date(last))

        return {
            lastTransactionFormatted,
            timestamp: last
        }
    }

    async function loadTransaction () {
        try {
            const dataKey = "@gofinances:transactions"

            const response = await AsyncStorage.getItem(dataKey)

            const transactions = response ? JSON.parse(response) : []

            let entriesTotal = 0;
            let expensiveTotal = 0;

            const transactionFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
                
                switch (item.type) {
                    case "positive":
                        entriesTotal += Number(item.amount)
                        break;
                    case "negative":
                        expensiveTotal += Number(item.amount)
                        break;
                    default:
                        break;
                }

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

            const lastTransactionEntries = getLastTransactionDate(transactions, 'positive')
            const lastTransactionExpansive = getLastTransactionDate(transactions, 'negative')

            const lastTransactionDate = new Date(
                lastTransactionEntries.timestamp > lastTransactionExpansive.timestamp 
                    ? lastTransactionEntries?.timestamp
                    : lastTransactionExpansive?.timestamp).toLocaleDateString('pt-BR', {
                        day: "2-digit",
                        month: "long",
                    })

            setHighlightData({
                entries: {
                    amount: entriesTotal.toLocaleString('pt-BR', {
                        style: "currency",
                        currency: "BRL"
                    }),
                    lastTransaction: `Última entrada dia ${lastTransactionEntries.lastTransactionFormatted}`,
                },
                expensives: {
                    amount: expensiveTotal.toLocaleString('pt-BR', {
                        style: "currency",
                        currency: "BRL"
                    }),
                    lastTransaction: `Última saída dia ${lastTransactionExpansive.lastTransactionFormatted}`,
                },
                total: {
                    amount: (entriesTotal - expensiveTotal).toLocaleString('pt-BR', {
                        style: "currency",
                        currency: "BRL"
                    }),
                    lastTransaction:  `01 à ${lastTransactionDate}`,
                }
            })
            
            setTransactions(transactionFormatted)
            setIsLoading(false)
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
            {
                isLoading ? (
                    <LoadContainer>
                        <ActivityIndicator 
                            size="large"
                            color={theme.colors.secoundary}
                        />
                    </LoadContainer>
                ) : (
                    <>
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
                                amount={highlightData.entries.amount}
                                lastTransaction={highlightData.entries.lastTransaction}
                            />
                            <HighlightCard
                                type="down"
                                title="Saídas"
                                amount={highlightData.expensives.amount}
                                lastTransaction={highlightData.expensives.lastTransaction}
                            />
                            <HighlightCard
                                type="total"
                                title="Total"
                                amount={highlightData.total.amount}
                                lastTransaction={highlightData.total.lastTransaction}
                            />
                        </HighlightCards>

                        <Transactions>
                            <Title>Listagem</Title>

                            <TransactionsList
                                data={transactions}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => <TransactionCard data={item} />}
                            />
                        </Transactions>
                    </>
                )
            }
        </Container>
    )
}