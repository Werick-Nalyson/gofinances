import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from 'styled-components/native'
import { VictoryPie } from 'victory-native'

import { HistoryCard } from '../../components/HistoryCard'

import { 
    Container,
    Header,
    Title,
    ChartContainer,
    Content
} from './styles'
import { TransactionCardProps } from '../../components/TransactionCard'
import { categories } from '../../utils/categories'
import { RFValue } from 'react-native-responsive-fontsize'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface expensiveType {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume () {
    const [expensivesByCategory, setExpensivesByCategory] = useState<expensiveType[]>([])

    const theme = useTheme()

    async function loadExpensives () {
        try {
            const dataKey = "@gofinances:transactions"

            const response = await AsyncStorage.getItem(dataKey)

            const responseFormatted = response ? JSON.parse(response) : []

            const expensives: DataListProps[] = responseFormatted
                .filter((item: DataListProps) => item.type === 'negative')

            const expensivesTotal = expensives.reduce((acumulator: number, item) => {
                return acumulator + Number(item.amount)
            }, 0)

            const totalByCategory: expensiveType[] = []

            categories.forEach(category => {
                let categorySum = 0;

                expensives.forEach(expensive => {
                    if (expensive.category === category.key) {
                        categorySum += Number(expensive.amount)
                    }
                })

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`
                
                if (categorySum > 0) {
                    const totalFormatted = categorySum.toLocaleString('pt-BR', {
                        style: "currency",
                        currency: "BRL"
                    })
                    
                    totalByCategory.push({
                        key: category.key,
                        name: category.name,
                        color: category.color,
                        totalFormatted,
                        total: categorySum,
                        percent
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

            <ChartContainer>
                <VictoryPie
                    data={expensivesByCategory}
                    colorScale={expensivesByCategory.map(category => category.color)}
                    style={{
                        labels: {
                            fontSize: RFValue(18),
                            fontWeight: "bold",
                            fill: theme.colors.shape
                        }
                    }}
                    labelRadius={50}
                    x="percent"
                    y="total"
                />
            </ChartContainer>

            <Content>
                {expensivesByCategory.map(expensive => (
                    <HistoryCard
                        key={expensive.key}
                        title={expensive.name}
                        amount={expensive.totalFormatted}
                        color={expensive.color}
                    />
                ))}
            </Content>

        </Container>
    )
}