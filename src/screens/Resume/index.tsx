import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from 'styled-components/native'
import { VictoryPie } from 'victory-native'
import { addMonths, format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { HistoryCard } from '../../components/HistoryCard'

import { 
    Container,
    Header,
    Title,
    ChartContainer,
    Content,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
} from './styles'
import { TransactionCardProps } from '../../components/TransactionCard'
import { categories } from '../../utils/categories'
import { RFValue } from 'react-native-responsive-fontsize'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { ActivityIndicator } from 'react-native'

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
    const theme = useTheme()
    
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [expensivesByCategory, setExpensivesByCategory] = useState<expensiveType[]>([])
    

    function handleDateChange (action: 'next' | 'prev') {
        setIsLoading(true)
        
        if (action === "next") {
            setSelectedDate(oldValue => addMonths(oldValue, 1))
        }

        if (action === "prev") {
            setSelectedDate(oldValue => subMonths(oldValue, 1))
        }
    }

    async function loadExpensives () {
        setIsLoading(true)

        const dataKey = "@gofinances:transactions"
        
        try {

            const response = await AsyncStorage.getItem(dataKey)

            const responseFormatted = response ? JSON.parse(response) : []

            const expensives: DataListProps[] = responseFormatted
                .filter((item: DataListProps) => 
                    item.type === 'negative'
                    && new Date(item.date).getMonth() === selectedDate.getMonth()
                    && new Date(item.date).getFullYear() === selectedDate.getFullYear()
                )

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
            setIsLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    useFocusEffect(useCallback(() => {
        loadExpensives()
    }, [selectedDate]))

    return (
        <Container>
            <Header>
                <Title>Resumo</Title>
            </Header>

            {
                isLoading ? (
                    <LoadContainer>
                        <ActivityIndicator
                            size="large"
                            color={theme.colors.secoundary}
                        />
                    </LoadContainer>
                ) : (
                    <Content
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: useBottomTabBarHeight()
                        }}
                    >
                        <MonthSelect>
                            <MonthSelectButton onPress={() => handleDateChange('prev')}>
                                <MonthSelectIcon name="chevron-left" />
                            </MonthSelectButton>

                            <Month>
                                { format(selectedDate, 'MMMM, yyyy', { locale: ptBR }) }
                            </Month>

                            <MonthSelectButton onPress={() => handleDateChange('next')}>
                                <MonthSelectIcon name="chevron-right" />
                            </MonthSelectButton>
                        </MonthSelect>

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

                        {expensivesByCategory.map(expensive => (
                            <HistoryCard
                                key={expensive.key}
                                title={expensive.name}
                                amount={expensive.totalFormatted}
                                color={expensive.color}
                            />
                        ))}
                    </Content>
                )
            }

        </Container>
    )
}