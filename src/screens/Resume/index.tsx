import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { HistoryCard } from '../../components/HistoryCard'

import { 
    Container,
    Header,
    Title,
    Content
} from './styles'
import { TransactionCardProps } from '../../components/TransactionCard'
import { categories } from '../../utils/categories'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface expensiveType {
    key: string;
    name: string;
    total: string;
    color: string;
}

export function Resume () {
    const [expensivesByCategory, setExpensivesByCategory] = useState<expensiveType[]>([])

    async function loadExpensives () {
        try {
            const dataKey = "@gofinances:transactions"

            const response = await AsyncStorage.getItem(dataKey)

            const responseFormatted = response ? JSON.parse(response) : []

            const expensives: DataListProps[] = responseFormatted
                .filter((item: DataListProps) => item.type === 'negative')

            const totalByCategory: expensiveType[] = []

            categories.forEach(category => {
                let categorySum = 0;

                expensives.forEach(expensive => {
                    if (expensive.category === category.key) {
                        categorySum += Number(expensive.amount)
                    }
                })
                
                if (categorySum > 0) {
                    const total = categorySum.toLocaleString('pt-BR', {
                        style: "currency",
                        currency: "BRL"
                    })
                    
                    totalByCategory.push({
                        key: category.key,
                        name: category.name,
                        color: category.color,
                        total,
                    })
                }
            })


            setExpensivesByCategory(totalByCategory)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        loadExpensives()
    }, [])

    useFocusEffect(useCallback(() => {
        loadExpensives()
    }, []))

    return (
        <Container>
            <Header>
                <Title>Resumo</Title>
            </Header>

            <Content>
                {expensivesByCategory.map(expensive => (
                    <HistoryCard
                        key={expensive.key}
                        title={expensive.name}
                        amount={expensive.total}
                        color={expensive.color}
                    />
                ))}
            </Content>

        </Container>
    )
}